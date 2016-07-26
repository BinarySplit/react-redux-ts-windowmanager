import {Action} from "redux/index";
import {isWindowAction, CREATE_WINDOW, CreateWindowAction} from "../actions/Window";
import {WindowState, WindowReducer, WindowVisibility} from "./WindowReducer";

export type WindowListState = WindowState[]; //Ordered from back to front

let initialWindows:WindowState[] = [];
for(var i = 0; i < 100; i++) {
    initialWindows.push({
        windowId: -i,
        component: "foo",
        visibility: WindowVisibility.Normal,
        pos: [i*10,(i%10)*100],
        size: [100, 100]
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
                size: [100,100]
            };
            let newList = state.concat(newWindow);
            //TODO: sort
            return newList;
        }

        default: {
            if(isWindowAction(action)) {
                let newList = state.slice(0);
                let idx = newList.findIndex(w => w.windowId == action.windowId);
                if(idx == -1) throw new Error("Invalid windowId in action:" + JSON.stringify(action));
                //Move to the end of newList
                newList.push(WindowReducer(newList.splice(idx, 1)[0], action));
                //TODO: sort
                return newList;
            }
            return state;
        }
    }
}
