import {Action} from "redux/index";
import {isWindowAction, CREATE_WINDOW, CreateWindowAction, CLOSE_WINDOW, WindowAction} from "../actions/Window";
import {WindowState, WindowReducer, WindowVisibility} from "./WindowReducer";

export type WindowListState = WindowState[]; //Ordered from back to front

let initialWindows:WindowState[] = [];
for(var i = 0; i < 10; i++) {
    initialWindows.push({
        windowId: -i,
        component: "AboutThisSite",
        visibility: WindowVisibility.Normal,
        pos: [i*50,(i%10)*50],
        size: [400, 300]
    });
}

export function WindowListReducer(state: WindowListState = initialWindows, action:Action) {
    switch(action.type) {
        case CREATE_WINDOW: {
            let {windowId, component} = action as CreateWindowAction;
            let newWindow:WindowState = {
                windowId, component,
                visibility: WindowVisibility.Normal,
                pos: [0,0],
                size: [400,300]
            };
            let newList = state.concat(newWindow);
            //TODO: sort
            return newList;
        }
        case CLOSE_WINDOW: {
            let closeAction = action as WindowAction;

            let newList = state.slice(0);
            let idx = newList.findIndex(w => w.windowId == closeAction.windowId);
            if(idx == -1) throw new Error("Invalid windowId in action:" + JSON.stringify(action));
            newList.splice(idx, 1);

            return newList;
        }

        default: {
            if(isWindowAction(action)) {
                let newList = state.slice(0);
                let idx = newList.findIndex(w => w.windowId == action.windowId);
                if(idx == -1) throw new Error("Invalid windowId in action:" + JSON.stringify(action));
                //Move to the end of newList
                newList.push(WindowReducer(newList.splice(idx, 1)[0], action));
                return newList;
            }
            return state;
        }
    }
}
