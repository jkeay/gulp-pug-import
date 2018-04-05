'use strict';
const path = require('path');
const through = require('through2');

module.exports = (options) => {
    options = options || {};

    return through.obj((file, encoding, callback) => {
        if(file.isNull() || file.isStream()) {
            callback();
            return;
        }

        console.log(file.buffer);

        callback();
    });
}
