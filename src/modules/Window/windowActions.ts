import {Action} from "redux/index";
import {DragAction, DRAG_START, DRAG, DRAG_END, dragStart} from "../Drag/dragActions";

//Consts
export const OPEN_WINDOW = "OPEN_WINDOW";
export const CLOSE_WINDOW = "CLOSE_WINDOW";
export const DRAG_WINDOW = "DRAG_WINDOW";
export const RESIZE_WINDOW = "RESIZE_WINDOW";
export const ACTIVATE_WINDOW = "ACTIVATE_WINDOW";

//Types
export interface WindowAction extends Action {
    windowId: number;
}
export interface CreateWindowAction extends Action {
    componentType: string;
    componentArgs: any;
    title: string;
}
export interface DragWindowActionArgs {
    initialWindowPos: [number, number];
}
export type DragWindowAction = DragAction & WindowAction & DragWindowActionArgs;

export const enum ResizeSide {T=0, R=1, B=2, L=3, TL=4, TR=5, BR=6, BL=7}
export interface ResizeWindowActionArgs {
    windowId: number;
    initialWindowPos: [number, number];
    initialWindowSize: [number, number];
    side: ResizeSide;
}
export type ResizeWindowAction = DragAction & WindowAction & ResizeWindowActionArgs;

//Action Creators
export function createWindow(componentType: string, componentArgs: any, title: string): CreateWindowAction {
    return {type: OPEN_WINDOW, componentType, componentArgs, title};
}
export function closeWindow(windowId: number): WindowAction {
    return {type: CLOSE_WINDOW, windowId};
}
export function dragWindow(windowId: number, initialWindowPos: [number, number], event: React.MouseEvent<HTMLElement>): DragWindowAction {
    return dragStart(event, DRAG_WINDOW, {windowId, initialWindowPos});
}
export function resizeWindow(windowId: number,
                             side: ResizeSide,
                             initialWindowPos: [number, number],
                             initialWindowSize: [number, number],
                             event: React.MouseEvent<HTMLElement>): ResizeWindowAction {
    return dragStart(event, RESIZE_WINDOW, {windowId, side, initialWindowPos, initialWindowSize});
}
export function activateWindow(windowId: number): WindowAction {
    return {type: ACTIVATE_WINDOW, windowId};
}
//Utils
export function isWindowAction(action: Action): action is WindowAction {
    return action && typeof (action as WindowAction).windowId === "number";
}
export function isDragWindowAction(action: Action): action is DragWindowAction {
    return (action.type == DRAG_START || action.type == DRAG || action.type == DRAG_END)
        && (action as DragAction).dragType == DRAG_WINDOW;
}
export function isResizeWindowAction(action: Action): action is ResizeWindowAction {
    return (action.type == DRAG_START || action.type == DRAG || action.type == DRAG_END)
        && (action as DragAction).dragType == RESIZE_WINDOW;
}

