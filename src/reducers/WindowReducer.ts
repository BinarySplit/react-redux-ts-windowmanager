import {isDragWindowAction} from "../actions/Window";
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
