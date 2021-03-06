'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: false,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: '[name].js',
    publicPath: '/assets/'
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: 8000,
    publicPath: '/assets/',
    noInfo: false,
    stats: {
      colors: true,
      hash: false,
      chunks: false,
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      actions: `${defaultSettings.srcPath}/actions/`,
      components: `${defaultSettings.srcPath}/components/`,
      sources: `${defaultSettings.srcPath}/sources/`,
      stores: `${defaultSettings.srcPath}/stores/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {}
};
