/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');


let app = new WebpackDevServer(webpack(config), config[0].devServer);

app.listen(config[0].port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config[0].port);
  console.log('Opening your system browser...');
  //open('http://localhost:' + config.port + '/webpack-dev-server/');
});
