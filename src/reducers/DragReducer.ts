import {Action} from "redux/index";
import {DragAction, DRAG_START, DRAG_END} from "../actions/Drag";

export interface DragParams {
    dragType: string,
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
            return {dragType, initialDragPos, args};
        }
        case DRAG_END: {
            return null;
        }
        default: {
            return state;
        }
    }
}
