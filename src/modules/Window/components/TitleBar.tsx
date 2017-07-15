import * as React from "react";

interface TitleBarProps {
    title: string;
    onDragStart: React.MouseEventHandler<HTMLElement>;
    onClose: ()=>any;
}

export class TitleBar extends React.PureComponent<TitleBarProps, {}> {
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
