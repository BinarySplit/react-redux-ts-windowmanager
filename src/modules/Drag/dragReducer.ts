import {Action} from "redux/index";
import {DragAction, DRAG_START, DRAG_END, DRAG} from "./dragActions";

export interface DragParams {
    dragType: string,
    isDragging: Boolean, //Whether the drag has moved sufficiently to be considered intentional
    initialDragPos: [number, number],
    args: any
}
const initialState: DragParams = null;

export function DragReducer(state: DragParams = initialState, action:Action):DragParams {
    switch(action.type) {
        case DRAG_START: {
            let {dragType, initialDragPos} = action as DragAction;
            let args = Object.assign({}, action) as DragAction;
            delete args.type;
            delete args.dragType;
            delete args.initialDragPos;
            return {dragType, isDragging: false, initialDragPos, args};
        }
        case DRAG: {
            let dragAction = action as DragAction;
            let dist = Math.abs(dragAction.deltaDragPos[0]) + Math.abs(dragAction.deltaDragPos[1]);
            if(state && !state.isDragging && dist > 10) {
                return Object.assign({}, state, {isDragging: true});
            } else {
                return state;
            }
        }
        case DRAG_END: {
            return null;
        }
        default: {
            return state;
        }
    }
}
