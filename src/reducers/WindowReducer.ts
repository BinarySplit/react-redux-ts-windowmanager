import {WindowState} from "../stores/WindowState";
import {DRAG, DragAction} from "../actions/DragAndDrop";
import {isDragWindowAction} from "../actions/Window";

export default function(state:WindowState, action:any):WindowState {
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
