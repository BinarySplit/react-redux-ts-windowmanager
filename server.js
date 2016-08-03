/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
const devConfig = require(path.join(__dirname, 'cfg/dev'))

let app = new WebpackDevServer(webpack(devConfig), devConfig.devServer);

process.env.REACT_WEBPACK_ENV = "dev";

app.listen(devConfig.devServer.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at http://localhost:' + devConfig.devServer.port + '/');
  //console.log('Opening your system browser...');
  //open('http://localhost:' + config.port + '/webpack-dev-server/');
});
