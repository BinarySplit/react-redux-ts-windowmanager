import * as React from "react";
import {Action} from "redux/index";
import "styles/Window.less";
import {dragWindow, ResizeSide, resizeWindow, closeWindow, activateWindow} from "../actions/Window";
import * as shallowCompare from "react-addons-shallow-compare";
import {memoize, memoizeMethod} from "../utils/memoize";
import {WindowState} from "../reducers/WindowReducer";
import {AboutThisSiteComponent} from "./AboutThisSite";
import ComponentClass = __React.ComponentClass;
import SFC = __React.SFC;
import ClassType = __React.ClassType;

interface WindowProps {
    window: WindowState,
    isTopmost: Boolean,
    dispatch: (a:Action) => Action
}

let components: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>}  = {
    AboutThisSite: AboutThisSiteComponent
};

interface TitleBarProps {
    title: string;
    onDragStart: __React.MouseEventHandler;
    onClose: ()=>any;
}

class TitleBar extends React.Component<TitleBarProps, void> {
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


export default class Window extends React.Component<WindowProps, void> {
    displayName: "Window";
    constructor(props: WindowProps) {
        super(props);
        this.onWindowDragStart = this.onWindowDragStart.bind(this);
        this.onWindowClose = this.onWindowClose.bind(this);
        this.onWindowContentMouseDown = this.onWindowContentMouseDown.bind(this);
        for(var i = 0; i < 8; i++) {
            this.onWindowResizeStart[i] = this.onWindowResizeStartFn.bind(this, i);
        }
    }

    shouldComponentUpdate(nextProps:WindowProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    static absolutePosition(pos:[number,number], size:[number,number]) {
        return {
            position: "absolute",
            left: pos[0],
            top: pos[1],
            width: size[0],
            height: size[1]
        };
    }
    onWindowDragStart(event:__React.MouseEvent) {
        if(typeof event.button === "number" && event.button > 0) return;

        let {windowId, pos} = this.props.window;
        this.props.dispatch(dragWindow(windowId, pos, event));
        event.preventDefault();
    }
    onWindowClose() {
        this.props.dispatch(closeWindow(this.props.window.windowId));
    }
    onWindowResizeStartFn(side:ResizeSide, event:__React.MouseEvent) {
        if(typeof event.button === "number" && event.button > 0) return;

        let {windowId, pos, size} = this.props.window;
        this.props.dispatch(resizeWindow(windowId, side, pos, size, event));
    }
    onWindowResizeStart: ((event:__React.MouseEvent) => any)[] = [];
    onWindowContentMouseDown() {
        let {isTopmost, dispatch, window} = this.props;
        if(!isTopmost) {
            dispatch(activateWindow(window.windowId));
        }
    }

    @memoizeMethod
    renderContent(Component: any) {
        return <div className="wm-window-content">{Component && <Component />}</div>;
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
        let {windowId, pos, componentType, title, size} = this.props.window;
        let Component = components[componentType];

        return (<div className="wm-window" key={windowId} style={Window.absolutePosition(pos, size)}>
            {this.renderLeftCol()}
            <div className="wm-window-col wm-window-center">
                <div className="wm-window-cell wm-window-top" onMouseDown={this.onWindowResizeStart[ResizeSide.T]} />
                <div className="wm-window-cell wm-window-middle" onMouseDown={this.onWindowContentMouseDown}>
                    {this.renderTitleBar(title)}
                    {this.renderContent(Component)}
                </div>
                <div className="wm-window-cell wm-window-bottom" onMouseDown={this.onWindowResizeStart[ResizeSide.B]} />
            </div>
            {this.renderRightCol()}
        </div>);
    }
}

