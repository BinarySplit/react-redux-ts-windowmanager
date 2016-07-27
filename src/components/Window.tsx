import * as React from "react";
import {Action} from "redux/index";
import "styles/Window.less";
import {DRAG_WINDOW, DragWindowActionArgs, dragWindow, ResizeSide, resizeWindow} from "../actions/Window";
import * as shallowCompare from "react-addons-shallow-compare";
import ReactChild = __React.ReactChild;
import {makeMemoizer, Memoizer} from "../utils/makeMemoizer";
import {WindowState} from "../reducers/WindowReducer";
import {dragStart} from "../actions/Drag";

interface WindowProps {
    window: WindowState,
    dispatch: (a:Action) => Action
}

interface TableRowProps {
    className: string;
    //children?: ReactChild;
    onDragLeft?: __React.EventHandler<__React.DragEvent>;
    onDragCenter?: __React.EventHandler<__React.DragEvent>;
    onDragRight?: __React.EventHandler<__React.DragEvent>;
}

class TableRow extends React.Component<TableRowProps, void> {

    shouldComponentUpdate(nextProps:TableRowProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        let {className, children, onDragLeft, onDragCenter, onDragRight} = this.props;

        let leftProps = onDragLeft ? {draggable: true, onDragStart: onDragLeft} : null;
        let centerProps = onDragCenter ? {draggable: true, onDragStart: onDragCenter} : null;
        let rightProps = onDragRight ? {draggable: true, onDragStart: onDragRight} : null;

        return <tr className={className}>
            <td className="wm-window-left" {...leftProps}/>
            <td className="wm-window-center" {...centerProps}>{children}</td>
            <td className="wm-window-right"  {...rightProps}/>
        </tr>;
    }
}

interface TitleBarProps {
    title: string;
    onDragStart: __React.EventHandler<__React.DragEvent>;
}

class TitleBar extends React.Component<TitleBarProps, void> {
    shouldComponentUpdate(nextProps:TitleBarProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {

        return <div className="wm-window-titlebar" onDragStart={this.props.onDragStart} draggable={true}>
            <div className="wm-window-title">{this.props.title}</div>
            <div className="wm-window-buttons">
                <div className="wm-window-button-minimize" />
                <div className="wm-window-button-maximize" />
                <div className="wm-window-button-close" />
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
    onWindowDragStart(event:__React.DragEvent) {
        let {windowId, pos} = this.props.window;
        this.props.dispatch(dragWindow(windowId, pos, event));

    }
    onWindowResizeStartFn(side:ResizeSide, event:__React.DragEvent) {
        let {windowId, pos, size} = this.props.window;
        this.props.dispatch(resizeWindow(windowId, side, pos, size, event));
    }
    onWindowResizeStart: ((event:__React.DragEvent) => any)[] = [];
    render() {
        let {windowId, pos, size} = this.props.window;
        let content = "content";
        let title = "title";

        return (<table className="wm-window" key={windowId} style={Window.absolutePosition(pos, size)}>
            <tbody>
                <TableRow className="wm-window-top"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.TL]}
                          onDragCenter={this.onWindowResizeStart[ResizeSide.T]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.TR]}/>
                <TableRow className="wm-window-titlerow"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.L]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.R]}>
                    {this.memoize("titlebar", [title, this.onWindowDragStart],
                        (title, onDragStart) =>
                            <TitleBar title={title} onDragStart={this.onWindowDragStart} />)}
                </TableRow>
                <TableRow className="wm-window-middle"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.L]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.R]}>
                    {this.memoize("content", [content],
                        (content) => <div className="wm-window-content">{content}</div>)}
                </TableRow>
                <TableRow className="wm-window-bottom"
                          onDragLeft={this.onWindowResizeStart[ResizeSide.BL]}
                          onDragCenter={this.onWindowResizeStart[ResizeSide.B]}
                          onDragRight={this.onWindowResizeStart[ResizeSide.BR]}/>
            </tbody>
        </table>);
    }
}

