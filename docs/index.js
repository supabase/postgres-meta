// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');

const maybe = require('call-me-maybe');

// @ts-ignore
var hljs = require('highlight.js');
var hlpath = path.resolve(require.resolve('highlight.js'),'..','..');

const emoji = require('markdown-it-emoji');
const attrs = require('markdown-it-attrs');
var md = require('markdown-it')({
    linkify: true, html: true,
    highlight: function (str, lang) {
        var slang = lang.split('--')[0]; // allows multiple language tabs for the same language
        if (slang && hljs.getLanguage(slang)) {
            try {
                return '<pre class="highlight tab tab-' + lang + '"><code>' +
                    hljs.highlight(slang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }

        return '<pre class="highlight"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
}).use(require('markdown-it-lazy-headers'));
md.use(emoji);
const yaml = require('yaml');
const ejs = require('ejs');
const uglify = require('uglify-js');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');

let seenIds = {};
let globalOptions = {};

function safeReadFileSync(filename,encoding) {
    try {
        return fs.readFileSync(filename,encoding);
    }
    catch (ex) {
        console.error(`shins: included file ${filename} not found`);
        if (globalOptions.cli) process.exit(1);
    }
    return '';
}

function javascript_include_tag(include) {
    var includeStr = safeReadFileSync(path.join(globalOptions.root, '/source/javascripts/' + include + '.inc'), 'utf8');
    if (globalOptions.minify) {
        var scripts = [];
        var includes = includeStr.split('\r').join().split('\n');
        for (var i in includes) {
            var inc = includes[i];
            var elements = inc.split('"');
            if (elements[1]) {
                if (elements[1] == 'text/javascript') {
                    scripts.push(path.join(globalOptions.root, 'source/javascripts/all_nosearch.js'));
                    break;
                }
                else {
                    scripts.push(path.join(globalOptions.root, elements[1]));
                }
            }
        }
        var bundle = uglify.minify(scripts);
        if (globalOptions.inline) {
            includeStr = '<script>'+bundle.code+'</script>';
        }
        else {
            fs.writeFileSync(path.join(globalOptions.root, '/pub/js/shins.js'), bundle.code, 'utf8');
            includeStr = safeReadFileSync(path.join(globalOptions.root, '/source/javascripts/' + include + '.bundle.inc'), 'utf8');
        }
    }
    return includeStr;
}

function partial(include) {
    var includePath = '';
    if (include.indexOf('/') === 0) {
        includePath = path.join(globalOptions.root, include + '.md');
    }
    else {
        let components = include.split('/');
        components[components.length-1] = '_'+components[components.length-1]+'.md';
        includePath = path.join(globalOptions.root, '/source/includes/'+components.join('/'));
    }
    var includeStr = safeReadFileSync(includePath, 'utf8');
    return postProcess(md.render(clean(includeStr)));
}

function replaceAll(target, find, replace) {
    return target.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

function stylesheet_link_tag(stylesheet, media) {
    var override = stylesheet;
    if ((stylesheet !== 'print') && (stylesheet !== 'screen')) {
        override = 'theme';
    }
    if (globalOptions.inline) {
        var stylePath = path.join(globalOptions.root, '/pub/css/' + stylesheet + '.css');
        if (!fs.existsSync(stylePath)) {
            stylePath = path.join(hlpath, '/styles/' + stylesheet + '.css');
        }
        var styleContent = safeReadFileSync(stylePath, 'utf8');
        styleContent = replaceAll(styleContent, '../../source/fonts/', globalOptions.fonturl||'https://raw.githubusercontent.com/Mermade/shins/master/source/fonts/');
        styleContent = replaceAll(styleContent, '../../source/', 'source/');
        if (globalOptions.customCss) {
            let overrideFilename = path.join(globalOptions.root, '/pub/css/' + override + '_overrides.css');
            if (fs.existsSync(overrideFilename)) {
                styleContent += '\n' + safeReadFileSync(overrideFilename, 'utf8');
            }
        }
        if (globalOptions.css) {
            if (fs.existsSync(globalOptions.css)) {
                styleContent += '\n' + safeReadFileSync(globalOptions.css, 'utf8');
            }
        }
        return '<style media="'+media+'">'+styleContent+'</style>';
    }
    else {
        if (media == 'screen') {
            var target = path.join(globalOptions.root, '/pub/css/' + stylesheet + '.css');
            if (!fs.existsSync(target)) {
                var source = path.join(hlpath, '/styles/' + stylesheet + '.css');
                fs.writeFileSync(target, safeReadFileSync(source,'utf8'));
            }
        }
        var include = '<link rel="stylesheet" media="' + media + '" href="pub/css/' + stylesheet + '.css">';
        if (globalOptions.css && stylesheet === 'screen') {
            include += '\n    <link rel="stylesheet" media="' + media + '" href="' + globalOptions.css + '">';
        }
        if (globalOptions.customCss) {
            include += '\n    <link rel="stylesheet" media="' + media + '" href="pub/css/' + override + '_overrides.css">';
        }
        return include;
    }
}

function language_array(language_tabs) {
    var result = [];
    for (var lang in language_tabs) {
        if (typeof language_tabs[lang] === 'object') {
            result.push(Object.keys(language_tabs[lang])[0]);
        }
        else {
            result.push(language_tabs[lang]);
        }
    }
    return JSON.stringify(result).split('"').join('&quot;');
}

function preProcess(content,options) {
    let lines = content.split('\r').join('').split('\n');
    const comments = [];
    comments.push('<!-- Renderer: Shins v'+globalOptions.shins.version+' -->');
    for (let l=0;l<lines.length;l++) {
        let line = lines[l];
        if (line.indexOf('<!--') >= 0) comments.push(line);
        let filename = '';
        if (line.startsWith('include::') && line.endsWith('[]')) { // asciidoc syntax
            filename = line.split(':')[2].replace('[]','');
        }
        else if (line.startsWith('!INCLUDE ')) { // markdown-pp syntax
            filename = line.replace('!INCLUDE ','');
        }
        if (filename) {
            if (options.source) filename = path.resolve(path.dirname(options.source),filename);
            let s = safeReadFileSync(filename,'utf8');
            let include = s.split('\r').join('').split('\n');
            lines.splice(l,1,...include);
        }
        else lines[l] = line;
    }
    globalOptions.comments = comments;
    return lines.join('\n');
}

function cleanId(id, unique) {
    id = id.toLowerCase().replace(/\W/g, '-');
    if (unique && seenIds[id]) id += '-' + ++seenIds[id]
    else seenIds[id] = 1;
    return id;
}

function postProcess(content) {
    // clean up headers which already have ids
    content = content.replace(/\<(h[123456]) id="(.*)"\>(.*)\<\/h[123456]\>/g, function (match, header, id, title) {
        return '<' + header + ' id="' + cleanId(id,false) + '">' + title + '</' + header + '>';
    });

    // adds id a la GitHub autolinks to automatically-generated headers
    content = content.replace(/\<(h[123456])\>(.*)\<\/h[123456]\>/g, function (match, header, title) {
        return '<' + header + ' id="' + cleanId(title,true) + '">' + title + '</' + header + '>';
    });

    content = content + globalOptions.comments.join('\n');
    return content;
}

function clean(s) {
    if (!s) return '';
    if (globalOptions.unsafe) return s;
    let sanitizeOptions = {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'h1', 'h2', 'img', 'aside', 'article', 'details',
            'summary', 'abbr', 'meta', 'link' ]),
        allowedAttributes: { a: [ 'href', 'id', 'name', 'target', 'class' ], img: [ 'src', 'alt', 'class' ] , aside: [ 'class' ],
            abbr: [ 'title', 'class' ], details: [ 'open', 'class' ], div: [ 'class' ], meta: [ 'name', 'content' ],
            link: [ 'rel', 'href', 'type', 'sizes' ],
            h1: [ 'id' ], h2: [ 'id' ], h3: [ 'id' ], h4: [ 'id' ], h5: [ 'id' ], h6: [ 'id' ],
            table: [ 'class' ], tr: [ 'class' ], td: [ 'class' ],
            blockquote: [ 'class', 'id' ]}
    };
    // replace things which look like tags which sanitizeHtml will eat
    s = s.split('\n>').join('\n$1$');
    s = s.split('>=').join('$2$');
    s = s.split('<=').join('$3$');
    let a = s.split('```');
    for (let i=0;i<a.length;i++) {
        if (!a[i].startsWith('xml')) {
            a[i] = sanitizeHtml(a[i],sanitizeOptions);
        }
    }
    s = a.join('```');
    // put back things which sanitizeHtml has mangled
    s = s.split('&quot;').join('"');
    s = s.split('&amp;').join('&');
    s = s.split('&gt;').join('>');
    s = s.split('&lt;').join('<');
    s = s.split('\n$1$').join('\n>');
    s = s.split('$2$').join('>=');
    s = s.split('$3$').join('<=');
    return s;
}

function getBase64ImageSource(imageSource, imgContent) {
    if (!imageSource || !imgContent) return "";

    var mimeType = getMimeType(imageSource);
    return "data:" + mimeType + ";base64," + Buffer.from(imgContent).toString('base64');
}

function getMimeType(imageSource) {
    var extension = path.extname(imageSource).toLowerCase();
    switch(extension) {
        case ".svg":
            return "image/svg+xml";
        case ".webp":
            return "image/webp";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        default:
            return "image/png";
    }
}

function render(inputStr, options, callback) {
    if (typeof callback === 'undefined') { // for pre-v1.4.0 compatibility
        callback = options;
        options = {};
    }
    if (options.attr) md.use(attrs);
    if (options['no-links']) md.disable('linkify');
    if (options.inline == true) {
        options.minify = true;
    }
    if (typeof options.root === 'undefined') {
        options.root = __dirname;
    }
    seenIds = {}; // reinitialise
    return maybe(callback, new Promise(function (resolve, reject) {
        globalOptions = options;
        // @ts-ignore
        globalOptions.shins = require('./package.json');

        inputStr = inputStr.split('\r\n').join('\n');
        var inputArr = ('\n' + inputStr).split('\n---\n');
        if (inputArr.length === 1) {
            inputArr = ('\n' + inputStr).split('\n--- \n');
        }
        var headerStr = inputArr[1];
        var header = yaml.parse(headerStr);
        if (!header) header = {};

        /* non-matching languages between Ruby Rouge and highlight.js at 2016/07/10 are
        ['ceylon','common_lisp','conf','cowscript','erb','factor','io','json-doc','liquid','literate_coffeescript','literate_haskell','llvm','make',
        'objective_c','plaintext','praat','properties','racket','sass','sed','shell','slim','sml','toml','tulip','viml'];*/
        var sh = hljs.getLanguage('bash');
        hljs.registerLanguage('shell', function (hljs) { return sh; });
        hljs.registerLanguage('sh', function (hljs) { return sh; });

        while (inputArr.length<3) inputArr.push('');

        var content = preProcess(inputArr[2],options);
        content = md.render(clean(content));
        content = postProcess(content);

        var locals = {};
        locals.current_page = {};
        locals.current_page.data = header;
        locals.page_content = content;
        locals.toc_data = function(content) {
            var $ = cheerio.load(content);
            var result = [];
            var h1,h2,h3,h4,h5;
            var headingLevel = header.headingLevel || 2;
            $(':header').each(function(e){
                var tag = $(this).get(0).tagName.toLowerCase();
                var entry = {};
                if (tag === 'h1') {
                    entry.id = $(this).attr('id');
                    entry.title = $(this).text();
                    entry.content = $(this).html();
                    entry.children = [];
                    h1 = entry;
                    result.push(entry);
                }
                if (tag === 'h2') {
                    let child = {};
                    child.id = $(this).attr('id');
                    entry.title = $(this).text();
                    child.content = $(this).html();
                    child.children = [];
                    h2 = child;
                    if (h1) h1.children.push(child);
                }
                if ((headingLevel >= 3) && (tag === 'h3')) {
                    let child = {};
                    child.id = $(this).attr('id');
                    entry.title = $(this).text();
                    child.content = $(this).html();
                    child.children = [];
                    h3 = child;
                    if (h2) h2.children.push(child);
                }
                if ((headingLevel >= 4) && (tag === 'h4')) {
                    let child = {};
                    child.id = $(this).attr('id');
                    entry.title = $(this).text();
                    child.content = $(this).html();
                    child.children = [];
                    h4 = child;
                    if (h3) h3.children.push(child);
                }
                if ((headingLevel >= 5) && (tag === 'h5')) {
                    let child = {};
                    child.id = $(this).attr('id');
                    entry.title = $(this).text();
                    child.content = $(this).html();
                    child.children = [];
                    h5 = child;
                    if (h4) h4.children.push(child);
                }
                if ((headingLevel >= 6) && (tag === 'h6')) {
                    let child = {};
                    child.id = $(this).attr('id');
                    entry.title = $(this).text();
                    child.content = $(this).html();
                    if (h5) h5.children.push(child);
                }
            });
            return result; //[{id:'test',content:'hello',children:[]}];
        };
        locals.partial = partial;
        locals.image_tag = function (image, altText, className) {
            var imageSource = "source/images/" + image;
            if (globalOptions.inline) {
                var imgContent = safeReadFileSync(path.join(globalOptions.root, imageSource));
                imageSource = getBase64ImageSource(imageSource, imgContent);
            }
            return '<img src="'+imageSource+'" class="' + className + '" alt="' + altText + '">';
        };
        locals.logo_image_tag = function () {
            if (!globalOptions.logo) return locals.image_tag('logo.png', 'Logo', 'logo');
            var imageSource = path.resolve(process.cwd(), globalOptions.logo);
            var imgContent = safeReadFileSync(imageSource);
            if (globalOptions.inline) {
                imageSource = getBase64ImageSource(imageSource, imgContent);
            } else {
                var logoPath = "source/images/custom_logo" + path.extname(imageSource);
                fs.writeFileSync(path.join(globalOptions.root, logoPath), imgContent);
                imageSource = logoPath;
            }
            var html = '<img src="' + imageSource + '" class="logo" alt="Logo">';
            if (globalOptions['logo-url']) {
                html = '<a href="' + md.utils.escapeHtml(globalOptions['logo-url']) + '">' + html + '</a>';
            }
            return html;
        };
        locals.stylesheet_link_tag = stylesheet_link_tag;
        locals.javascript_include_tag = javascript_include_tag;
        locals.language_array = language_array;

        var ejsOptions = {};
        ejsOptions.debug = false;
        ejs.renderFile(path.resolve(globalOptions.root, options.layout || 'source/layouts/layout.ejs'), locals, ejsOptions, function (err, str) {
            if (err) reject(err)
            else resolve(str);
        });
    }));
}

module.exports = {
    render: render,
    srcDir: function () { return globalOptions.root; }
};

