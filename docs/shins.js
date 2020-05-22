#!/usr/bin/env node
// @ts-check

'use strict';

const fs = require('fs');
const path = require('path');
const options = require('tiny-opts-parser')(process.argv);
const shins = require('./index.js');

if (options.customcss) options.customCss = options.customcss; // backwards compatibility

var inputName = './source/index.html.md';

if (options._.length > 2) {
    inputName = options._[2];
}

if (options.h) options.help   = options.h;
if (options.a) options.attr   = options.a;
if (options.l) options.layout = options.l;
if (options.o) options.output = options.o;
if (options.r) options.root   = options.r;

if (options.help) {
    console.log('Usage: node shins [options] [input-markdown-filename]');
    console.log();
    console.log('-h,--help   show help and exit');
    console.log('-a,--attr   allow css attributes in markdown');
    console.log('--customcss include custom override css files');
    console.log('--fonturl   url to fonts when --inline is set, defaults to github repo');
    console.log('--inline    inline css and javascript resources');
    console.log('-l,--layout specify path to template file in .ejs format')
    console.log('--logo      specify path to custom logo file');
    console.log('--logo-url  url to link to from logo image');
    console.log('--css       specify path to additional css file')
    console.log('--minify    minify output html');
    console.log('-o,--output specify output html file');
    console.log('-r,--root   specify root directory containing source and pub directories');
    console.log('--unsafe    do not sanitise input markdown');
    console.log('--no-links  do not automatically convert links in text to anchor tags');
    process.exit(0);
}

var inputStr = fs.readFileSync(inputName,'utf8');
options.source = inputName;
options.cli = true;

shins.render(inputStr,options,function(err,str){
    if (err) {
        console.log(err);
    }
    else {
        str = str.split('\r').join('');
        fs.writeFileSync(options.output||path.join(options.root,'index.html'),str,'utf8');
    }
});
