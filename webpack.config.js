'use strict';
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    context: __dirname + '/src',
    entry: {
        app: './app.js',
    },
    output: {
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: false,
            allChunks: true
        })
    ],
    devtool: "eval-source-map"

};

module.exports = config;
