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
import {IconState, IconListState} from "../reducers/IconListReducer";
import {Icon} from "../components/Icon";




interface WindowManagerProps {
    windows: WindowListState;
    iconList: IconListState;
    dragParams: DragParams;
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
    renderWindow(key: string, window: WindowState, isTopmost: Boolean) {
        return <Window key={key} window={window} isTopmost={isTopmost} dispatch={this.props.dispatch} />;
    }
    @memoizeMethodWithKey
    renderIcon(key: string, icon: IconState) {
        return <Icon key={key} icon={icon} dispatch={this.props.dispatch} />
    }
    render() {
        let {windows, iconList} = this.props;
        let topWindowIdx = windows.length - 1;
        return (
            <div className="wm-window-manager"
                 onMouseMove={this.onMouseEvent}
                 onMouseUp={this.onMouseEvent}>
                <div id="icons">
                    {iconList.icons
                        .filter(i => i.container == "desktop")
                        .map(i => this.renderIcon(i.iconId.toString(), i))}
                </div>
                <div id="ghostIcon">
                    {iconList.ghostIcon && this.renderIcon("ghost", iconList.ghostIcon)}
                </div>
                <div id="windows">
                    {windows.map((w, i) => this.renderWindow(w.windowId.toString(), w, i == topWindowIdx))}
                </div>
            </div>
        );
    }
}
export default
connect(
    function ({windows, iconList, dragParams}:MainState, ownProps:{}):{} {
        return {windows, iconList, dragParams};
    },
    null
)(WindowManagerComponent);


