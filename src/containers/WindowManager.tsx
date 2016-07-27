import 'normalize.css/normalize.css';
import '../styles/App.css';
import * as React from 'react';
import {connect} from "react-redux";
import {Action} from "redux/index";
import {createWindow} from "../actions/Window";
import Window from "../components/Window";
import {makeMemoizer, Memoizer} from "../utils/makeMemoizer";
import {WindowListState} from "../reducers/WindowListReducer";
import {DragParams} from "../reducers/DragReducer";
import {MainState} from "../reducers/index";
import {drag, dragEnd} from "../actions/Drag";

//const yeomanImage = require('../images/yeoman.png');

const emptyDragImage = document.createElement("image");

interface WindowManagerProps {
    windows: WindowListState,
    dragParams: DragParams
    dispatch: (a:Action) => Action; //Workaround for WebStorm error highlighting bug https://youtrack.jetbrains.com/issue/WEB-22374
}

function mapObject<TVal, TColl extends {[k:string]:TVal}, TResult>
    (obj: TColl, fn:(val:TVal, key:string, coll:TColl) => TResult): TResult[] {
    return Object.keys(obj).map(k=>fn(obj[k] as TVal, k, obj));
}

function eventPreventDefault(event:__React.SyntheticEvent) {
    event.preventDefault();
}

class WindowManagerComponent extends React.Component<WindowManagerProps, {}> {
    static displayName: "WindowManagerComponent";
    constructor(props:WindowManagerProps) {
        super(props);
        this.onDragEvent = this.onDragEvent.bind(this);
        this.onCreateWindow = this.onCreateWindow.bind(this);
        this.memoize = makeMemoizer();
    }
    memoize: Memoizer;
    onDragEvent(event:__React.DragEvent) {
        let {dragParams, dispatch} = this.props;
        //An event with the coordinates of the top of the browser's UI window ([0, -30]) is created
        // right before dragend if drag events haven't had their default prevented, or the browser is lagging
        if(event.pageY < 0) return;
        if(dragParams != null) {
            dispatch(event.type == "drag"
                     ? drag(event, dragParams)
                     : dragEnd(event, dragParams));
        }
        let dt = event.dataTransfer;
        dt.dropEffect = "none";
        dt.effectAllowed = "none";
        dt.clearData();
        if(typeof (dt as any).setDragImage === "function")
            (dt as any).setDragImage(emptyDragImage, 0, 0);
        event.preventDefault();
    }
    onCreateWindow() {
        this.props.dispatch(createWindow("foo"));
    }
    render() {
        let {windows, dispatch} = this.props;
        return (
            <div className="wm-window-manager"
                 onDrag={this.onDragEvent}
                 onDragEnd={this.onDragEvent}
                 onDragOver={eventPreventDefault}
                 onDrop={eventPreventDefault}>
                <div id="windows">
                    {windows.map((w) =>
                        this.memoize("window" + w.windowId, [w, dispatch],
                            (w, dispatch) => (<Window key={w.windowId} window={w} dispatch={dispatch} />)))}
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


