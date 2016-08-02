import {Action} from "redux/index";
import {DragParams} from "./dragReducer";


export const DRAG_START = "DRAG_START";
export const DRAG = "DRAG";
export const DRAG_END = "DRAG_END";

export interface DragAction extends Action {
    dragType: string;
    isDragging: Boolean; //Whether the drag has moved far enough away from the origin to be considered intentional
    initialDragPos: [number, number];
    deltaDragPos: [number, number];
    dragPos: [number, number];
    container: string,
    containerPos: [number, number]
}

/*reduced interface from MouseEvent / __React.MouseEvent exposing only the needed fields*/
export interface MouseEventForDrag {
    pageX: number;
    pageY: number;
    target: EventTarget;
}

export function dragStart<T>(event: MouseEventForDrag, dragType: string, args:T): DragAction & T {
    let {target, pageX, pageY} = event;
    let {container, containerPos} = getTargetContainer(target as Node, pageX, pageY);
    return Object.assign({}, args, {
        type: DRAG_START,
        dragType,
        isDragging: false,
        initialDragPos: [event.pageX, event.pageY] as [number, number],
        deltaDragPos: [0, 0] as [number, number],
        dragPos: [event.pageX, event.pageY] as [number, number],
        container,
        containerPos,
    });
}
function dragEvent(type: string, event: MouseEventForDrag, dragParams: DragParams): DragAction {
    let {target, pageX, pageY} = event;
    let {container, containerPos} = getTargetContainer(target as Node, pageX, pageY);
    let {dragType, isDragging, initialDragPos, args} = dragParams;
    return Object.assign({}, args, {
        type,
        dragType,
        isDragging,
        initialDragPos,
        deltaDragPos: [event.pageX - initialDragPos[0], event.pageY - initialDragPos[1]] as [number, number],
        dragPos: [event.pageX, event.pageY] as [number, number],
        container,
        containerPos,
    });

}

export function drag(event: MouseEventForDrag, dragParams: DragParams): DragAction {
    return dragEvent(DRAG, event, dragParams);
}
export function dragEnd(event: MouseEventForDrag, dragParams: DragParams): DragAction {
    return dragEvent(DRAG_END, event, dragParams);
}

function getTargetContainer(target: Node, pageX: number, pageY: number): {container: string, containerPos: [number, number]} {
    while(target && (!(target instanceof HTMLElement) || !(target as HTMLElement).hasAttribute("data-container-name")))
        target = target.parentNode;

    if(target == null) {
        return {container: null, containerPos: [pageX, pageY]};
    } else {
        let elem = target as HTMLElement;
        let container = elem.getAttribute("data-container-name");
        let elemX = 0;
        let elemY = 0;

        if (elem.offsetParent) {
            do {
                elemX += elem.offsetLeft;
                elemY += elem.offsetTop;
            } while ((elem.offsetParent instanceof HTMLElement) && (elem = elem.offsetParent as HTMLElement));
        }
        return {container, containerPos: [pageX - elemX, pageY - elemY]};
    }
}
