'use strict';
const path = require('path');
const through = require('through2');
const PluginError = require('plugin-error');
const PLUGIN_NAME = 'gulp-pug-import';

function addPrintError(contents) {
    contents += `pug_rethrow(err, pug_debug_filename, pug_debug_line){ \
console.log("Error: " + err); \
console.log("File: " + pug_debug_filename); \
console.log("Line: " + pug_debug_line); \
}`;
    return contents;
}

function setExportModule(contents, className) {
    contents = `export default class ${className} {${contents}};`;
    return contents;
}

function capitalizeFirstCharacter(str) {
    return `${str[0].toUpperCase()}${str.slice(1)}`
}

function gulpPugImport(options) {
    options = options || {};

    let stream = through.obj(function(file, encoding, callback) {
        if(file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }

        const pattern = /(?=template\(locals\))[\s\S]*/;
        let contents = file.contents.toString('utf-8').match(pattern)[0];
        const tokens = file.path.split('\\');
        const className = capitalizeFirstCharacter(tokens[tokens.length - 1].replace('.js', ''));
        file.contents = new Buffer(setExportModule(addPrintError(contents), className), "utf-8");

        this.push(file);
        callback();
    });

    return stream;
}

module.exports = gulpPugImport;
