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


if(typeof document !== "undefined") {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    );

    //Defer loading icon images until page has rendered
    var cb = function() {
        var l = document.createElement('link'); l.rel = 'stylesheet';
        l.href = 'assets/icon-images.css';
        var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
    };
    var raf = requestAnimationFrame || mozRequestAnimationFrame ||
        webkitRequestAnimationFrame || msRequestAnimationFrame;
    if (raf) raf(cb);
    else window.addEventListener('load', cb);
}