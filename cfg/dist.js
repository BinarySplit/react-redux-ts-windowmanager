'use strict';

let path = require('path');
let webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: {
    app: ['./src/index'],
    "icon-images": ['./src/styles/IconImages.less']
  },
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
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.html$/,
    //   minRatio: 0.95
    // }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("[name].css", {allChunks: true}),

  ],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  module: defaultSettings.getDefaultModules(baseConfig.additionalPaths, false)
});

// Add needed loaders to the defaults here
config.module.loaders.push();

module.exports = config;
