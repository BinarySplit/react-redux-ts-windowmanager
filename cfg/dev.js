'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: {
    app: [
      'webpack-dev-server/client?http://127.0.0.1:' + baseConfig.devServer.port,
      'webpack/hot/only-dev-server',
      './src/index',
    ]
  },
  cache: true,
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new ExtractTextPlugin("[name].css", {allChunks: true}),
  ],
  module: defaultSettings.getDefaultModules(baseConfig.additionalPaths, true)
});


module.exports = config;
