import * as React from 'react';
let {Component} = React;
import Main from '../components/WindowManager';


export default class App extends Component<{},{}> {
    static propTypes = {};
    render() {
        let foo = this;
        return <Main />;
    }
}

