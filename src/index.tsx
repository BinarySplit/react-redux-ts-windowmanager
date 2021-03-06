import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/App';
import {configureStore} from "./app/appStore";

declare let process: any;

if(process.env.NODE_ENV !== 'production') {
    (window as any).Perf = require('react-addons-perf');
    (window as any).Perf.start();
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

//Defer loading icon images until page has rendered
var loadDeferredCss = function() {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = require('!file?name=icon-images.css!less!./images/icon-images.less') as string;
    var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
};
if (window.requestAnimationFrame) {
    window.requestAnimationFrame(loadDeferredCss);
} else {
    window.addEventListener('load', loadDeferredCss);
}
