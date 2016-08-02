import * as React from 'react';
let {Component} = React;
import Main from './WindowManager';


export default class App extends Component<{},{}> {
    static propTypes = {};
    render() {
        return <Main />;
    }
}

