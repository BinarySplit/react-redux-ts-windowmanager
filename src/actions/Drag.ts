import {Action} from "redux/index";
import {DragParams} from "../reducers/DragReducer";


export const DRAG_START = "DRAG_START";
export const DRAG = "DRAG";
export const DRAG_END = "DRAG_END";

export interface DragAction extends Action {
    dragType: string,
    initialDragPos: [number, number],
    deltaDragPos: [number, number],
    dragPos: [number, number]
}

/*reduced interface from MouseEvent / __React.MouseEvent exposing only the needed fields*/
export interface MouseEventForDrag {
    pageX: number,
    pageY: number
}

export function dragStart<T>(event: MouseEventForDrag, dragType: string, args:T): DragAction & T {
    return Object.assign({}, args, {
        type: DRAG_START,
        dragType,
        initialDragPos: [event.pageX, event.pageY] as [number, number],
        deltaDragPos: [0, 0] as [number, number],
        dragPos: [event.pageX, event.pageY] as [number, number]
    });
}
export function drag(event: MouseEventForDrag, dragParams: DragParams): DragAction {
    let {dragType, initialDragPos, args} = dragParams;
    return Object.assign({}, args, {
        type: DRAG,
        dragType,
        initialDragPos,
        deltaDragPos: [event.pageX - initialDragPos[0], event.pageY - initialDragPos[1]] as [number, number],
        dragPos: [event.pageX, event.pageY] as [number, number]
    });
}
export function dragEnd(event: MouseEventForDrag, dragParams: DragParams): DragAction {
    let {dragType, initialDragPos, args} = dragParams;
    return Object.assign({}, args, {
        type: DRAG_END,
        dragType,
        initialDragPos,
        deltaDragPos: [event.pageX - initialDragPos[0], event.pageY - initialDragPos[1]] as [number, number],
        dragPos: [event.pageX, event.pageY] as [number, number]
    });
}