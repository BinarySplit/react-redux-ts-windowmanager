'use strict';

let path = require('path');
let webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: ['./src/index'],
  cache: false,
  devtool: false, //'source-map',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.optimize.AggressiveMergingPlugin({minSizeReduce: 1}),
    new webpack.optimize.UglifyJsPlugin({
      //compress: {warnings: true}
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      minRatio: 0.95
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
