import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './stores';
import App from './containers/App';

declare const process:any;
declare const window:any;
if(process.env.NODE_ENV !== 'production') {
    window.Perf = require('react-addons-perf')
}

const store = configureStore();



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);