import {Action} from "redux/index";
import {DragParams} from "../stores/index";
import {DragAction, DRAG_START, DRAG_END} from "../actions/DragAndDrop";



export default function(state: DragParams, action:Action):DragParams {
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
