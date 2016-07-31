import {Action} from "redux/index";
import {DragAction, DRAG_START, DRAG_END} from "../actions/Drag";

export interface DragParams {
    dragType: string,
    initialPos: [number, number],
    args: any
}
const initialState: DragParams = null;

export function DragReducer(state: DragParams = initialState, action:Action):DragParams {
    switch(action.type) {
        case DRAG_START: {
            let {dragType, initialPos} = action as DragAction;
            let args = Object.assign({}, action) as DragAction;
            delete args.type;
            delete args.dragType;
            delete args.initialPos;
            return {dragType, initialPos, args};
        }
        case DRAG_END: {
            return null;
        }
        default: {
            return state;
        }
    }
}
