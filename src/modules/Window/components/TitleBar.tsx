import * as React from "react";
import * as shallowCompare from "react-addons-shallow-compare";

interface TitleBarProps {
    title: string;
    onDragStart: __React.MouseEventHandler;
    onClose: ()=>any;
}

export class TitleBar extends React.Component<TitleBarProps, void> {
    shouldComponentUpdate(nextProps:TitleBarProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        let {title, onDragStart, onClose} = this.props;
        return <div className="wm-window-titlebar">
            <div className="wm-window-button-close" onClick={onClose} />
            <div className="wm-window-title" onMouseDown={onDragStart}>{title}</div>
            <div className="wm-window-button-minimize" />
            <div className="wm-window-button-maximize" />
        </div>
    }
}
