'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
    entry: {'static': './src/renderStatic'},
    cache: true,
    output: {
        path: path.join(__dirname, '/../dist'),
        filename: 'static.js',
        publicPath: "/",
        libraryTarget: 'umd'
    },
    plugins: [
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        }),
        new StaticSiteGeneratorPlugin('static', ['/'], {})
    ],
    module: {
        preLoaders: [
            {
                test: /\.(ts|tsx)$/,
                loader: "babel-loader!ts-loader"
            },
        ],
        loaders: [
        {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader'
        },
        {
            test: /\.(css|less|png|jpg|gif|woff|woff2)$/,
            loader: 'null-loader'
        }
    ]
    }
});


module.exports = config;
