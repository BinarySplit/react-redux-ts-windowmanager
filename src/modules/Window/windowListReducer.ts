import {Action} from "redux/index";
import {isWindowAction, OPEN_WINDOW, CreateWindowAction, CLOSE_WINDOW, WindowAction} from "./windowActions";
import {WindowState, windowReducer, WindowVisibility} from "./windowReducer";

export interface WindowFocusAction {
    actionId: number, //not meaningful. Just a field that reliably changes every time a new action is "fired"
    windowId: number
}

export interface WindowListStateFields {
    windowsById: WindowState[],
    windowOrder: number[],
    nextWindowId: number,
    focusedWindowId: number
}
export type WindowListState = WindowListStateFields & {};

const initialState: WindowListState = {
    windowsById: [
        {
            componentType: "",
            title: "Foo Bar",
            visibility: WindowVisibility.Normal,
            pos: [200, 100],
            size: [400, 300]
        },
        {
            componentType: "",
            title: "Baz Qux",
            visibility: WindowVisibility.Normal,
            pos: [400, 150],
            size: [400, 300]
        },
        {
            componentType: "AboutThisSite",
            title: "About this site",
            visibility: WindowVisibility.Normal,
            pos: [300, 200],
            size: [400, 300]
        },
    ],
    windowOrder: [0,1,2],
    nextWindowId: 3,
    focusedWindowId: 2
};

function activateWindow(state: WindowListState, windowId: number): WindowListState {
    let {windowOrder} = state;
    let newWindowOrder: number[];
    if (windowId == windowOrder[windowOrder.length - 1]) {
        newWindowOrder = windowOrder;
    } else {
        //Move window to top of windowOrder stack & emit a focus action
        newWindowOrder = windowOrder.slice();
        let idx = newWindowOrder.indexOf(windowId);
        if(idx != -1) {
            newWindowOrder.splice(idx, 1);
        }
        newWindowOrder.push(windowId);
    }
    return Object.assign({}, state, {
        windowOrder: newWindowOrder,
        focusedWindowId: newWindowOrder[newWindowOrder.length - 1]
    });
}

export function windowListReducer(state: WindowListState = initialState, action:Action) {

    switch(action.type) {
        case OPEN_WINDOW: {

            let {componentType, title} = action as CreateWindowAction;
            //Check if window already exists - if so, activate existing window. Otherwise open new window.
            let existingWindowId = state.windowsById.findIndex(w => w != null && w.componentType == componentType);
            if(existingWindowId != -1) {
                return activateWindow(state, existingWindowId);
            } else {
                //Generate a new windowId
                let windowId = state.nextWindowId;
                //Create the new window
                let newWindowsById = state.windowsById.slice();
                newWindowsById[windowId] = {
                    componentType, title,
                    visibility: WindowVisibility.Normal,
                    pos: [0, 0],
                    size: [400, 300]
                };

                //Activate the new window
                return activateWindow(Object.assign({}, state, {
                    nextWindowId: state.nextWindowId + 1,
                    windowsById: newWindowsById
                }), windowId);
            }
        }
        case CLOSE_WINDOW: {
            let {windowId} = action as WindowAction;

            //Update windowsById
            let newWindowsById = state.windowsById.slice();
            newWindowsById[windowId] = null;

            //Update windowOrder
            let newWindowOrder = state.windowOrder.slice();
            let idx = newWindowOrder.indexOf(windowId);
            if(idx != -1) {
                newWindowOrder.splice(idx, 1);
            }

            return activateWindow(Object.assign({}, state, {
                    windowsById: newWindowsById,
                    windowOrder: newWindowOrder
                }),
                newWindowOrder[newWindowOrder.length - 1]
            );
        }

        default: {
            if (isWindowAction(action)) {
                let w = state.windowsById[action.windowId];
                if(w != null) {
                    let newWindowsById = state.windowsById.slice();
                    newWindowsById[action.windowId] = windowReducer(w, action);

                    return activateWindow(Object.assign({}, state, {
                            windowsById: newWindowsById
                        }), action.windowId);
                }
            }
            return state;
        }
    }
}
