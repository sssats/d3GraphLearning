'use strict';
var webpack = require('webpack');

var config = {
    context: __dirname + '/src', // `__dirname` is root of project and `src` is source
    entry: {
        app: './app.js',
    },
    output: {
        filename: 'app.js',
    },
    devtool: "eval-source-map" // Default development sourcemap
};

module.exports = config;