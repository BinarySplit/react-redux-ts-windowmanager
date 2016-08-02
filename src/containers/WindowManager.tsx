import 'normalize.css/normalize.css';
import '../styles/App.css';
import * as React from 'react';
import {connect} from "react-redux";
import {Action, Dispatch} from "redux/index";
import {createWindow} from "../actions/Window";
import Window from "../components/Window";
import {memoizeMethodWithKey, memoizeMethod} from "../utils/memoize";
import {DragParams} from "../reducers/DragReducer";
import {MainState} from "../reducers/index";
import {drag, dragEnd} from "../actions/Drag";
import {IconState, IconListState} from "../reducers/IconListReducer";
import {Icon} from "../components/Icon";
import {WindowListState} from "../reducers/WindowListReducer";
import {WindowState} from "../reducers/WindowReducer";
import * as shallowCompare from "react-addons-shallow-compare";

interface WindowsProps {
    windowList: WindowListState,
    dispatch: Dispatch<any>;
}

class WindowsList extends React.Component<WindowsProps, void> {

    shouldComponentUpdate(nextProps:WindowsProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    @memoizeMethodWithKey
    renderWindow(key: string, windowId: number, window: WindowState, isFocused: Boolean) {
        return <Window key={key} windowId={windowId} window={window} isFocused={isFocused} dispatch={this.props.dispatch} />;
    }
    render() {
        let {windowOrder, windowsById, focusedWindowId} = this.props.windowList;
        return <div className="wm-windows-list">
            {windowOrder.map(windowId => {
                let window = windowsById[windowId];
                return window && this.renderWindow(windowId.toString(), windowId, window, windowId == focusedWindowId)
            })}
        </div>;
    }
}

interface WindowManagerProps {
    windowList: WindowListState;
    iconList: IconListState;
    dragParams: DragParams;
    dispatch: Dispatch<any>; //Workaround for WebStorm error highlighting bug https://youtrack.jetbrains.com/issue/WEB-22374
}

class WindowManagerComponent extends React.Component<WindowManagerProps, {}> {
    static displayName: "WindowManagerComponent";
    constructor(props:WindowManagerProps) {
        super(props);
        this.onMouseEvent = this.onMouseEvent.bind(this);
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
    @memoizeMethodWithKey
    renderIcon(key: string, icon: IconState) {
        return <Icon key={key} icon={icon} dispatch={this.props.dispatch} />
    }
    render() {
        let {windowList, iconList} = this.props;
        return (
            <div className="wm-window-manager"
                 onMouseMove={this.onMouseEvent}
                 onMouseUp={this.onMouseEvent}>
                <div id="icons">
                    {iconList.icons
                        .filter(i => i.container == "desktop")
                        .map(i => this.renderIcon(i.iconId.toString(), i))}
                </div>
                <WindowsList windowList={windowList} dispatch={this.props.dispatch} />
                <div id="ghostIcon">
                    {iconList.ghostIcon && this.renderIcon("ghost", iconList.ghostIcon)}
                </div>
            </div>
        );
    }
}
export default
connect(
    function ({windowList, iconList, dragParams}:MainState, ownProps:{}):{} {
        return {windowList, iconList, dragParams};
    },
    null
)(WindowManagerComponent);


