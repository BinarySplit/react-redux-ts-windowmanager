import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMServer from "react-dom/server";
import { Provider } from 'react-redux';
import { configureStore } from './stores';
import App from './containers/App';

function render (locals, callback) {
    const store = configureStore();
    let app = ReactDOMServer.renderToString(
        <Provider store={store}>
            <App />
        </Provider>);

    let html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>React Webpack Template Title</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" type="text/css" href="assets/app.css">
</head>
<body>
  <div id="app">${app}</div>

  <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
  <!-- Dependencies -->
  <script type="text/javascript" src="assets/react.js" defer></script>
  <script type="text/javascript" src="assets/react-dom.js" defer></script>

  <!-- Main -->
  <script type="text/javascript" src="assets/app.js" defer></script>
  
  <!-- Deferred CSS -->
  <noscript>
  <link rel="stylesheet" type="text/css" href="assets/icon-images.css">
  </noscript>
</body>
</html>
`;

    callback(null, html);
    return html;
}
module.exports = render;
