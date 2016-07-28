import * as React from "react";
import {Action} from "redux/index";
import "styles/Window.less";
import {dragWindow, ResizeSide, resizeWindow, closeWindow} from "../actions/Window";
import * as shallowCompare from "react-addons-shallow-compare";
import {makeMemoizer, Memoizer} from "../utils/makeMemoizer";
import {WindowState} from "../reducers/WindowReducer";
import {AboutThisSiteComponent} from "./AboutThisSite";
import ComponentClass = __React.ComponentClass;
import SFC = __React.SFC;
import ClassType = __React.ClassType;

interface WindowProps {
    window: WindowState,
    dispatch: (a:Action) => Action
}

interface TableRowProps {
    className: string;
    onDragLeft?: __React.MouseEventHandler;
    onDragCenter?: __React.MouseEventHandler;
    onDragRight?: __React.MouseEventHandler;
}

let components: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>}  = {
    AboutThisSite: AboutThisSiteComponent
}

class TableRow extends React.Component<TableRowProps, void> {

    shouldComponentUpdate(nextProps:TableRowProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        let {className, children, onDragLeft, onDragCenter, onDragRight} = this.props;

        return <tr className={className}>
            <td className="wm-window-left" onMouseDown={onDragLeft}/>
            <td className="wm-window-center" onMouseDown={onDragCenter}>{children}</td>
            <td className="wm-window-right" onMouseDown={onDragRight}/>
        </tr>;
    }
}

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
            <div className="wm-window-title" onMouseDown={onDragStart}>{title}</div>
            <div className="wm-window-buttons">
                <div className="wm-window-button-minimize" />
                <div className="wm-window-button-maximize" />
                <div className="wm-window-button-close" onClick={onClose} />
            </div>
        </div>
    }
}


export default class Window extends React.Component<WindowProps, void> {
    displayName: "Window";
    constructor(props: WindowProps) {
        super(props);
        this.memoize = makeMemoizer();
        this.onWindowDragStart = this.onWindowDragStart.bind(this);
        this.onWindowClose = this.onWindowClose.bind(this);
        for(var i = 0; i < 8; i++) {
            this.onWindowResizeStart[i] = this.onWindowResizeStartFn.bind(this, i);
        }
    }
    memoize: Memoizer;

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
    render() {
        let {windowId, pos, componentType, title, size} = this.props.window;
        let Component = components[componentType];
        let content = this.memoize("content", [Component],
            (Component) => <div className="wm-window-content">{Component && <Component />}</div>);

        return (<table className="wm-window" key={windowId} style={Window.absolutePosition(pos, size)}>
            <tbody>
                <TableRow className="wm-window-top"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.TL]}
                          onDragCenter={this.onWindowResizeStart[ResizeSide.T]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.TR]}/>
                <TableRow className="wm-window-titlerow"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.L]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.R]}>
                    <TitleBar title={title}
                              onDragStart={this.onWindowDragStart}
                              onClose={this.onWindowClose} />
                </TableRow>
                <TableRow className="wm-window-middle"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.L]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.R]}>
                    {content}
                </TableRow>
                <TableRow className="wm-window-bottom"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.BL]}
                          onDragCenter={this.onWindowResizeStart[ResizeSide.B]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.BR]}/>
            </tbody>
        </table>);
    }
}

