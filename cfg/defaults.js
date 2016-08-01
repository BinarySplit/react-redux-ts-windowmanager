/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const srcPath = path.join(__dirname, '/../src');
const dfltPort = 8000;

/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules(additionalPaths, isDev) {
    let loaders = [
        {
            test: /\.js$/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/,
            // loader: isDev
            //     ? 'style-loader!css-loader'
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        {
            test: /\.less$/,
            // loader: isDev
            //     ? 'style-loader!css-loader!less-loader'
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        },
        {
            test: /\.(png|jpg|gif|woff|woff2|svg)$/,
            loader: 'url-loader?limit=8192'
        },
        {
            test: /\.(js|jsx)$/,
            loader: isDev ? 'react-hot!babel-loader' : 'babel',
            include: [].concat(
                additionalPaths,
                [ path.join(__dirname, '/../src') ]
            )
        }
    ];

    return {
        preLoaders: [
            {
                test: /\.(ts|tsx)$/,
                loader: "babel-loader!ts-loader"
            },
        ],
        loaders
        /*externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        }*/
    };
}

module.exports = {
    srcPath: srcPath,
    publicPath: '/assets/',
    port: dfltPort,
    getDefaultModules: getDefaultModules
};
