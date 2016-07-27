import {isDragWindowAction, isResizeWindowAction, ResizeSide} from "../actions/Window";
import {DRAG} from "../actions/Drag";

export const enum WindowVisibility { Normal, Maximized, Minimized }

export interface WindowState {
    windowId: number,
    component: string,
    visibility: WindowVisibility,
    pos: [number, number],
    size: [number, number]
}

export function WindowReducer(state:WindowState, action:any):WindowState {
    switch(action.type) {
        case DRAG: {
            if(isDragWindowAction(action)) {
                let [x, y] = action.initialWindowPos;
                let [dx, dy] = action.deltaPos;
                return Object.assign({}, state, {
                    pos: [x + dx, y + dy] as [number, number]
                });
            } else if(isResizeWindowAction(action)) {
                console.log(action);
                let {side, initialWindowPos: [x,y], initialWindowSize: [w,h], deltaPos: [dx,dy]} = action;
                let newX = x, newY = y, newW = w, newH = h;
                let minWidth = 100, minHeight = 50;
                if(side == ResizeSide.L || side == ResizeSide.TL || side == ResizeSide.BL) {
                    newX = Math.min(x + dx, x + w - minWidth);
                    newW = Math.max(w - dx, minWidth);
                } else if(side == ResizeSide.R || side == ResizeSide.TR || side == ResizeSide.BR) {
                    newW = Math.max(w + dx, minWidth);
                }

                if(side == ResizeSide.T || side == ResizeSide.TL || side == ResizeSide.TR) {
                    newY = Math.min(y + dy, y + h - minHeight);
                    newH = Math.max(h - dy, minHeight);
                } else if(side == ResizeSide.B || side == ResizeSide.BL || side == ResizeSide.BR) {
                    newH = Math.max(y + dy, minHeight);
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
