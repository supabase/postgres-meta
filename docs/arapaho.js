#!/usr/bin/env node
// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const ejs = require('ejs');
const compression = require('compression');
const args = require('tiny-opts-parser')(process.argv);
const opn = require('opn');
const chokidar = require('chokidar');

const shins = require('./index.js');

let includesModified = false;
let lastGenTime = {};
if (args.p) args.preserve = args.p;
if (args.l) args.launch = args.l;
if (args.h) args.help = args.h;
if (args.v) args.verbose = args.v;

if (args.help) {
    console.log('Usage: node arapaho [port] [-l|--launch] [-p|--preserve] [shins-options]');
    process.exit(0);
}

let app = express();
app.use(compression());

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

if (fs.existsSync('source/includes')) {
    chokidar.watch('source/includes', {ignoreInitial:true}).on('all',function(eventType, filename) {
        if (args.verbose) console.log(eventType, filename);
        includesModified = true;
    });
}

function getLastGenTime(fpath) {
    if (lastGenTime[fpath]) return lastGenTime[fpath];
    return new Date(0);
}

function check(req,res,fpath) {
    fpath = fpath.split('/').join('');
    var srcStat = {mtime: new Date(0)};
    try {
        srcStat = fs.statSync(path.join(__dirname,'source',fpath+'.md'));
    }
    catch (ex) {}
    var dstStat = {mtime:getLastGenTime(fpath)};
    if (!args.preserve) {
        try {
            dstStat = fs.statSync(path.join(__dirname,fpath));
        }
        catch (ex) { }
    }
    if (includesModified || (srcStat.mtime>dstStat.mtime)) {
        includesModified = false;
        lastGenTime[fpath] = new Date();
        let source = path.join(__dirname,'source',fpath+'.md');
        console.log('Rebuilding',fpath,'from',source);
        fs.readFile(source,'utf8',function(err,markdown){
            if (markdown) {
                let options = Object.assign({},args);
                if (req.query.customcss) {
                    options.customCss = true;
                }
                if (req.query.inline) {
                    options.inline = true;
                }
                if (req.query.minify) {
                    options.minify = true;
                }
                if (req.query.attr) {
                    options.attr = true;
                }
                options.source = source;
                shins.render(markdown,options,function(err,html){
                    if (err) {
                        console.warn(err);
                        res.send(err);
                    }
                    else {
                        res.send(html);
                        if (!args.preserve) {
                            fs.writeFile(path.join(__dirname,fpath),html,'utf8',function(){});
                        }
                    }
                });
            }
            else {
                res.send(err);
            }
        });
    }
    else {
        res.render(path.join(__dirname,fpath));
    }
}

app.get('/', function(req,res) {
    check(req,res,'index.html');
});
app.get('*.html', function(req,res) {
    check(req,res,req.path);
});
app.use("/",  express.static(__dirname));

var myport = process.env.PORT || 4567;
if (args._.length>2) myport = args._[2];

var server = app.listen(myport, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Arapaho server listening at http://%s:%s', host, port);
  if (args.launch) {
    console.log('Launching...');

    var url = 'http://'+(host === '::' ? 'localhost' : 'host') + ':' +port+'/'
    opn(url).catch(function (ex) {
        console.error(`Unable to open URL '${url}'`);
        console.error(ex);
    })
  }
});
