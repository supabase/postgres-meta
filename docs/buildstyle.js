#!/bin/env node
// @ts-check

'use strict';

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const assetFunctions = require('node-sass-asset-functions');
const options = require('tiny-opts-parser')(process.argv);

const outputStyle = options._.length > 2 ? options._[2] : 'nested';

if (options.r) options.root = options.r;
if (!options.root) options.root = '.';

function sassRender(infile,outfile) {
	sass.render({
		file: infile,
		outputStyle : outputStyle,
		functions: assetFunctions({
			http_fonts_path: '../../source/fonts'
		})
	}, function(err, result) {
		if (err) console.error(err)
		else {
			fs.writeFile(outfile,result.css.toString(),'utf8',function(err){
                if (err) console.warn(err.message);
            });
        }
	});
}

sassRender(path.join(options.root,'source/stylesheets/screen.css.scss'),path.join(options.root,'pub/css/screen.css'));
sassRender(path.join(options.root,'source/stylesheets/print.css.scss'),path.join(options.root,'pub/css/print.css'));
