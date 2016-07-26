import * as React from "react";
import {Action} from "redux/index";
import "styles/Window.less";
import {DRAG_WINDOW, DragWindowActionArgs} from "../actions/Window";
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
    children?: ReactChild;
}

class TableRow extends React.Component<TableRowProps, void> {

    shouldComponentUpdate(nextProps:TableRowProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        let {className, children} = this.props;
        return <tr className={className}>
            <td className="wm-window-left" />
            <td className="wm-window-center">{children}</td>
            <td className="wm-window-right" />
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
        this.onWindowDragStart = this.onWindowDragStart.bind(this);
        this.memoize = makeMemoizer();
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
        let args: DragWindowActionArgs = { windowId, initialWindowPos: pos };
        this.props.dispatch(dragStart(event, DRAG_WINDOW, args));
    }
    render() {
        let {windowId, pos, size} = this.props.window;
        let content = "content";
        let title = "title";
        return (<table className="wm-window" key={windowId} style={Window.absolutePosition(pos, size)}>
            <tbody>
                <TableRow className="wm-window-top"/>
                <TableRow className="wm-window-titlerow">
                    {this.memoize("titlebar", [title, this.onWindowDragStart],
                        (title, onDragStart) =>
                            <TitleBar title={title} onDragStart={this.onWindowDragStart} />)}
                </TableRow>
                <TableRow className="wm-window-middle">
                    {this.memoize("content", [content],
                        (content) => <div className="wm-window-content">{content}</div>)}
                </TableRow>
                <TableRow className="wm-window-bottom"/>
            </tbody>
        </table>);
    }
}

