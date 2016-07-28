import {Action} from "redux/index";
import {DragParams} from "../reducers/DragReducer";


export const DRAG_START = "DRAG_START";
export const DRAG = "DRAG";
export const DRAG_END = "DRAG_END";

export interface DragAction extends Action {
    dragType: string,
    initialPos: [number, number],
    deltaPos: [number, number],
    pos: [number, number]
}

export function dragStart<T>(event: MouseEvent|__React.MouseEvent, dragType: string, args:T): DragAction & T {
    return Object.assign({}, args, {
        type: DRAG_START,
        dragType,
        initialPos: [event.pageX, event.pageY] as [number, number],
        deltaPos: [0, 0] as [number, number],
        pos: [event.pageX, event.pageY] as [number, number]
    });
}
export function drag(event: MouseEvent|__React.MouseEvent, dragParams: DragParams): DragAction {
    let {dragType, initialPos, args} = dragParams;
    return Object.assign({}, args, {
        type: DRAG,
        dragType,
        initialPos,
        deltaPos: [event.pageX - initialPos[0], event.pageY - initialPos[1]] as [number, number],
        pos: [event.pageX, event.pageY] as [number, number]
    });
}
export function dragEnd(event: MouseEvent|__React.MouseEvent, dragParams: DragParams): DragAction {
    let {dragType, initialPos, args} = dragParams;
    return Object.assign({}, args, {
        type: DRAG_END,
        dragType,
        initialPos,
        deltaPos: [event.pageX - initialPos[0], event.pageY - initialPos[1]] as [number, number],
        pos: [event.pageX, event.pageY] as [number, number]
    });
}