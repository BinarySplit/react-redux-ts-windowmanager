import {isDragWindowAction, isResizeWindowAction, ResizeSide} from "./windowActions";
import {DRAG} from "../Drag/dragActions";

export const enum WindowVisibility { Normal, Maximized, Minimized }

export interface WindowState {
    componentType: string;
    componentArgs?: any;
    title: string;
    visibility: WindowVisibility;
    pos: [number, number];
    size: [number, number];
}

export function windowReducer(state:WindowState, action:any):WindowState {
    switch(action.type) {
        case DRAG:{
            if(isDragWindowAction(action)) {
                let [x, y] = action.initialWindowPos;
                let [dx, dy] = action.deltaDragPos;
                return Object.assign({}, state, {
                    pos: [x + dx, y + dy] as [number, number]
                });
            } else if(isResizeWindowAction(action)) {
                let {side, initialWindowPos: [x,y], initialWindowSize: [w,h], deltaDragPos: [dx,dy]} = action;
                let newX = x, newY = y, newW = w, newH = h;
                let minWidth = 100, minHeight = 50;

                //Horizontal resizing
                if(side == ResizeSide.L || side == ResizeSide.TL || side == ResizeSide.BL) {
                    newX = Math.min(x + dx, x + w - minWidth);
                    newW = Math.max(w - dx, minWidth);
                } else if(side == ResizeSide.R || side == ResizeSide.TR || side == ResizeSide.BR) {
                    newW = Math.max(w + dx, minWidth);
                }

                //Vertical resizing
                if(side == ResizeSide.T || side == ResizeSide.TL || side == ResizeSide.TR) {
                    newY = Math.min(y + dy, y + h - minHeight);
                    newH = Math.max(h - dy, minHeight);
                } else if(side == ResizeSide.B || side == ResizeSide.BL || side == ResizeSide.BR) {
                    newH = Math.max(h + dy, minHeight);
                }


                return Object.assign({}, state, {
                    pos: [newX, newY] as [number, number],
                    size: [newW, newH] as [number, number]
                });
            } else {
                return state;
            }
        }
        default: {
            /* Return original state if no actions were consumed. */
            return state;
        }
    }
}
