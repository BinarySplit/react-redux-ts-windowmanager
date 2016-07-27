import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './stores';
import App from './containers/App';

if(process.env.NODE_ENV !== 'production') {
    window.Perf = require('react-addons-perf');
    window.Perf.start();
} else {
    require('file?name=react.js!../node_modules/react/dist/react.min.js');
    require('file?name=react-dom.js!../node_modules/react-dom/dist/react-dom.min.js');
}

const store = configureStore();



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);