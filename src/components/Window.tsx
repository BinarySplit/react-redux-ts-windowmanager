import * as React from "react";
import {Action} from "redux/index";
import "styles/Window.less";
import {dragWindow, ResizeSide, resizeWindow, closeWindow, activateWindow} from "../actions/Window";
import * as shallowCompare from "react-addons-shallow-compare";
import {memoizeMethod} from "../utils/memoize";
import {WindowState} from "../reducers/WindowReducer";
import {AboutThisSiteComponent} from "./AboutThisSite";
import ComponentClass = __React.ComponentClass;
import SFC = __React.SFC;
import ClassType = __React.ClassType;
import {connect} from "react-redux";
import {MainState} from "../reducers/index";
import {TitleBar} from "./TitleBar";


let components: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>}  = {
    AboutThisSite: AboutThisSiteComponent
};

interface WindowProps {
    windowId: number;
    window: WindowState;
    isFocused: Boolean;
    dispatch: (a:Action) => Action;
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

        let {windowId, window} = this.props;
        this.props.dispatch(dragWindow(windowId, window.pos, event));
        event.preventDefault();
    }
    onWindowClose() {
        this.props.dispatch(closeWindow(this.props.windowId));
    }
    onWindowResizeStartFn(side:ResizeSide, event:__React.MouseEvent) {
        if(typeof event.button === "number" && event.button > 0) return;

        let {pos, size} = this.props.window;
        this.props.dispatch(resizeWindow(this.props.windowId, side, pos, size, event));
    }
    onWindowResizeStart: ((event:__React.MouseEvent) => any)[] = [];
    onWindowContentMouseDown() {
        let {isFocused, dispatch, windowId} = this.props;
        if(!isFocused) {
            dispatch(activateWindow(windowId));
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
        let {pos, componentType, title, size} = this.props.window;
        let Component = components[componentType];

        let className = this.props.isFocused ? "wm-window wm-window-focus" : "wm-window";

        return (<div className={className} style={Window.absolutePosition(pos, size)}>
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
