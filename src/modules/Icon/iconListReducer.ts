import {Action} from "redux/index";
import {DRAG_START, DRAG, DRAG_END} from "../Drag/dragActions";
import {isMoveIconAction} from "./iconActions";

//Coordinates for the middle of the icon
const iconMidWidth = 48;
const iconMidHeight = 32;

const iconGridWidth = 128;
const iconGridHeight = 128;

const iconGridOffsetX = 0;
const iconGridOffsetY = 16;

export interface IconState {
    iconId: number,
    container: string,
    pos: [number, number],
    imageClass: string,
    title: string,
    componentType: string,
    args: any,
}

export interface IconListState {
    nextId: number,
    icons: IconState[],
    ghostIcon: IconState, //For icons currently being dragged
    selectedId: number,
}

const initialState: IconListState = {
    nextId: 3,
    icons: [{
        iconId: 1,
        container: "desktop",
        pos: [0,0],
        imageClass: 'wm-icon-image-info',
        title: "About this site",
        componentType: "AboutThisSite",
        args: null
    }],
    ghostIcon: null,
    selectedId: null
};

export function IconListReducer(state: IconListState = initialState, action: Action): IconListState {
    if (isMoveIconAction(action)) {
        let icon = state.icons.filter(i => i.iconId == action.iconId)[0];
        if (icon != null) {
            let newPos = [
                Math.max(action.dragPos[0] - iconMidWidth, 0),
                Math.max(action.dragPos[1] - iconMidHeight, 0)
            ];
            console.log(action.type);
            switch (action.type) {
                case DRAG_START:
                case DRAG: {
                    //Extra check because it's possible for DRAG events to fire for a short window after a DRAG_END
                    //Mainly due to debounceReduxUpdate, but also partially due to React's (theoretically) async state updates
                    if(action.type != DRAG || state.ghostIcon != null) {
                        let newIcon = Object.assign({}, icon, {pos: newPos});
                        return Object.assign({}, state, {ghostIcon: newIcon});
                    } else {
                        return state;
                    }
                }
                case DRAG_END: {
                    //TODO: Don't move if hasn't been dragged more than threshold
                    //TODO: Clamp to within window
                    //Snap to grid
                    let snapPos = [
                        Math.round((newPos[0] - iconGridOffsetX) / iconGridWidth) * iconGridWidth + iconGridOffsetX,
                        Math.round((newPos[1] - iconGridOffsetY) / iconGridHeight) * iconGridHeight + iconGridOffsetY
                    ];
                    let newIcon = Object.assign({}, icon, { pos: snapPos });
                    let newIcons = state.icons.slice();
                    let idx = state.icons.indexOf(icon);
                    newIcons.splice(idx, 1, newIcon);
                    return Object.assign({}, state, { icons: newIcons, ghostIcon: null });
                }
            }
        } else {
            return state;
        }
    } else {
        switch (action.type) {

        }
    }
    return state;
}