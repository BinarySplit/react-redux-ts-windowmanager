import {Action} from "redux/index";
import {DragAction, DRAG_START, DRAG, DRAG_END} from "./DragAndDrop";

export const CREATE_WINDOW = "CREATE_WINDOW";
export const DRAG_WINDOW = "DRAG_WINDOW";


let _uniqueIdCounter = 1;
export function makeUniqueId(): number { return _uniqueIdCounter++ }

export interface WindowAction extends Action {
    windowId: number
}
export function isWindowAction(action: Action): action is WindowAction {
    return action && typeof (action as WindowAction).windowId === "number";
}

export interface CreateWindowAction extends WindowAction {
    component: string
}
export function createWindow(component: string): CreateWindowAction {
    return { type: CREATE_WINDOW, windowId: makeUniqueId(), component }
}

export interface DragWindowActionArgs {
    windowId: number,
    initialWindowPos: [number, number]
}
export function isDragWindowAction(action: Action): action is DragAction & DragWindowActionArgs {
    return (action.type == DRAG_START || action.type == DRAG || action.type == DRAG_END)
        && (action as DragAction).dragType == DRAG_WINDOW;
}