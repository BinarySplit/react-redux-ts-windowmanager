import 'normalize.css/normalize.css';
import '../styles/App.css';
import * as React from 'react';
import {connect} from "react-redux";
import {Action} from "redux/index";
import {createWindow} from "../actions/Window";
import Window from "../components/Window";
import {memoizeMethodWithKey} from "../utils/memoize";
import {WindowListState} from "../reducers/WindowListReducer";
import {DragParams} from "../reducers/DragReducer";
import {MainState} from "../reducers/index";
import {drag, dragEnd} from "../actions/Drag";
import {WindowState} from "../reducers/WindowReducer";

//const yeomanImage = require('../images/yeoman.png');

interface WindowManagerProps {
    windows: WindowListState,
    dragParams: DragParams
    dispatch: (a:Action) => Action; //Workaround for WebStorm error highlighting bug https://youtrack.jetbrains.com/issue/WEB-22374
}

class WindowManagerComponent extends React.Component<WindowManagerProps, {}> {
    static displayName: "WindowManagerComponent";
    constructor(props:WindowManagerProps) {
        super(props);
        this.onMouseEvent = this.onMouseEvent.bind(this);
        this.onCreateWindow = this.onCreateWindow.bind(this);
    }
    onMouseEvent(event:__React.MouseEvent) {
        let {dragParams, dispatch} = this.props;
        //An event with the coordinates of the top of the browser's UI window ([0, -30]) is created
        // right before dragend if drag events haven't had their default prevented, or the browser is lagging
        if(event.pageY < 0) return;
        if(typeof event.button === "number" && event.button > 0) return;
        if(dragParams != null) {
            dispatch(event.type == "mousemove"
                     ? drag(event, dragParams)
                     : dragEnd(event, dragParams));
            event.preventDefault();
        }
    }
    onCreateWindow(event:__React.MouseEvent) {
        if(typeof event.button === "number" && event.button > 0) return;

        this.props.dispatch(createWindow("", "Title"));
    }
    @memoizeMethodWithKey
    renderWindow(key: string, window: WindowState) {
        return <Window key={key} window={window} dispatch={this.props.dispatch} />;
    }
    render() {
        let {windows, dispatch} = this.props;
        return (
            <div className="wm-window-manager"
                 onMouseMove={this.onMouseEvent}
                 onMouseUp={this.onMouseEvent}>
                <div id="windows">
                    {windows.map((w) => this.renderWindow(w.windowId.toString(), w))}
                </div>
                <button onClick={this.onCreateWindow}>create window</button>
            </div>
        );
    }
}
export default
connect(
    function ({windows, dragParams}:MainState, ownProps:{}):{} {
        return {windows, dragParams};
    },
    null
)(WindowManagerComponent);


