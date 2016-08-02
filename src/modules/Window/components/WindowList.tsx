import * as shallowCompare from "react-addons-shallow-compare";
import * as React from "react";
import {Dispatch} from "redux/index";
import {WindowListState} from "../windowListReducer";
import {WindowState} from "../windowReducer";
import {Window} from "./Window";
import {memoizeMethodWithKey} from "../../../utils/memoize";

interface WindowListProps {
    windowList: WindowListState,
    dispatch: Dispatch<any>;
}

export default class WindowList extends React.Component<WindowListProps, void> {

    shouldComponentUpdate(nextProps:WindowListProps, nextState:void) {
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