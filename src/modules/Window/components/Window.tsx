import * as React from "react";
import {Action} from "redux/index";
import "../windowStyle.less";
import {dragWindow, ResizeSide, resizeWindow, closeWindow, activateWindow} from "../windowActions";
import {memoizeMethod} from "../../../utils/memoize";
import {WindowState} from "../windowReducer";
import {TitleBar} from "./TitleBar";
import {windowContentTypes} from "../../WindowContent/index";


interface WindowProps {
    windowId: number;
    window: WindowState;
    isFocused: Boolean;
    dispatch: (a:Action) => Action;
}

export class Window extends React.PureComponent<WindowProps, {}> {
    displayName: "Window";
    constructor(props: WindowProps) {
        super(props);
        this.onWindowDragStart = this.onWindowDragStart.bind(this);
        this.onWindowClose = this.onWindowClose.bind(this);
        this.onWindowContentClick = this.onWindowContentClick.bind(this);
        for(var i = 0; i < 8; i++) {
            this.onWindowResizeStart[i] = this.onWindowResizeStartFn.bind(this, i);
        }
    }

    static absolutePosition(pos:[number,number], size:[number,number]) {
        return {
            position: ("absolute" as "absolute"), // wtf typescript?
            left: pos[0],
            top: pos[1],
            width: size[0],
            height: size[1]
        };
    }
    onWindowDragStart(event:React.MouseEvent<HTMLElement>) {
        if(typeof event.button === "number" && event.button > 0) return;

        let {windowId, window} = this.props;
        this.props.dispatch(dragWindow(windowId, window.pos, event));
        event.preventDefault();
    }
    onWindowClose() {
        this.props.dispatch(closeWindow(this.props.windowId));
    }
    onWindowResizeStartFn(side:ResizeSide, event:React.MouseEvent<HTMLElement>) {
        if(typeof event.button === "number" && event.button > 0) return;

        let {pos, size} = this.props.window;
        this.props.dispatch(resizeWindow(this.props.windowId, side, pos, size, event));
    }
    onWindowResizeStart: ((event:React.MouseEvent<HTMLElement>) => any)[] = [];
    onWindowContentClick() {
        let {isFocused, dispatch, windowId} = this.props;
        if(!isFocused) {
            dispatch(activateWindow(windowId));
        }
    }

    @memoizeMethod
    renderContent(Component: any, componentArgs: any) {
        return <div className="wm-window-content">{Component && <Component {...componentArgs} />}</div>;
    }
    @memoizeMethod
    renderTitleBar(title: string) {
        return <TitleBar title={title} onDragStart={this.onWindowDragStart} onClose={this.onWindowClose} />;
    }
    @memoizeMethod
    renderLeftCol() {
        return <div className="wm-window-col wm-window-left">
            <div className="wm-window-cell wm-window-top" onMouseDown={this.onWindowResizeStart[ResizeSide.TL]} />
            <div className="wm-window-cell wm-window-middle" onMouseDown={this.onWindowResizeStart[ResizeSide.L]} />
            <div className="wm-window-cell wm-window-bottom" onMouseDown={this.onWindowResizeStart[ResizeSide.BL]} />
        </div>;
    }
    @memoizeMethod
    renderRightCol() {
        return <div className="wm-window-col wm-window-right">
            <div className="wm-window-cell wm-window-top" onMouseDown={this.onWindowResizeStart[ResizeSide.TR]} />
            <div className="wm-window-cell wm-window-middle" onMouseDown={this.onWindowResizeStart[ResizeSide.R]} />
            <div className="wm-window-cell wm-window-bottom" onMouseDown={this.onWindowResizeStart[ResizeSide.BR]} />
        </div>;
    }

    render() {
        let {pos, componentType, componentArgs, title, size} = this.props.window;
        let Component = windowContentTypes[componentType];

        let className = this.props.isFocused ? "wm-window wm-window-focus" : "wm-window";

        return (<div className={className} style={Window.absolutePosition(pos, size)}>
            {this.renderLeftCol()}
            <div className="wm-window-col wm-window-center">
                <div className="wm-window-cell wm-window-top" onMouseDown={this.onWindowResizeStart[ResizeSide.T]} />
                <div className="wm-window-cell wm-window-middle" onClick={this.onWindowContentClick}>
                    {this.renderTitleBar(title)}
                    {this.renderContent(Component, componentArgs)}
                </div>
                <div className="wm-window-cell wm-window-bottom" onMouseDown={this.onWindowResizeStart[ResizeSide.B]} />
            </div>
            {this.renderRightCol()}
        </div>);
    }
}
