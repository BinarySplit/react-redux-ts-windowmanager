import {Action} from "redux/index";
import {DRAG_START, DRAG, DRAG_END} from "../Drag/dragActions";
import {isMoveIconAction, MoveIconAction} from "./iconActions";

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
    componentArgs: any,
}

export interface IconListState {
    nextId: number,
    icons: IconState[],
    ghostIcon: IconState, //For icons currently being dragged
    ghostIconVisible: Boolean,
    selectedId: number,
}

function snapToGrid(newPos: [number, number]): [number, number] {
    return [
        Math.round((newPos[0] - iconGridOffsetX) / iconGridWidth) * iconGridWidth + iconGridOffsetX,
        Math.round((newPos[1] - iconGridOffsetY) / iconGridHeight) * iconGridHeight + iconGridOffsetY
    ];
}
function gridPos(x: number, y: number): [number, number] {
    return [x * iconGridWidth + iconGridOffsetX, y * iconGridHeight + iconGridOffsetY];
}

let nextId = 1;
const initialState: IconListState = {
    icons: [
        {
            iconId: nextId++,
            container: "desktop",
            pos: gridPos(0,0),
            imageClass: 'wm-icon-image-info',
            title: "About this site",
            componentType: "AboutThisSite",
            componentArgs: null
        },
        {
            iconId: nextId++,
            container: "desktop",
            pos: gridPos(1, 0),
            imageClass: 'wm-icon-image-info',
            title: "Welcome",
            componentType: "Folder",
            componentArgs: {container: "welcome"}
        },
        {
            iconId: nextId++,
            container: "welcome",
            pos: gridPos(0, 0),
            imageClass: 'wm-icon-image-info',
            title: "Potential Employer / Client",
            componentType: "Folder",
            componentArgs: {container: "welcome"}
        },
        {
            iconId: nextId++,
            container: "welcome",
            pos: gridPos(1, 0),
            imageClass: 'wm-icon-image-info',
            title: "Potential Collaborator / Friend",
            componentType: "Folder",
            componentArgs: {container: "welcome"}
        }
    ],
    nextId: nextId,
    ghostIcon: null,
    ghostIconVisible: false,
    selectedId: null
};

export function IconListReducer(state: IconListState = initialState, action: Action): IconListState {
    if (isMoveIconAction(action)) {
        let icon = state.icons.filter(i => i.iconId == (action as MoveIconAction).iconId)[0];
        if (icon != null) {
            switch (action.type) {
                case DRAG_START:
                case DRAG: {
                    //Extra check because it's possible for DRAG events to fire for a short window after a DRAG_END
                    //Mainly due to debounceReduxUpdate, but also partially due to React's (theoretically) async state updates
                    if(action.type != DRAG || state.ghostIcon != null) {
                        let newPos: [number,number] = [
                            Math.max(action.dragPos[0] - iconMidWidth, 0),
                            Math.max(action.dragPos[1] - iconMidHeight, 0)
                        ];
                        let newIcon = Object.assign({}, icon, {pos: newPos});
                        return Object.assign({}, state, {
                            ghostIcon: newIcon,
                            ghostIconVisible: action.isDragging
                        });
                    } else {
                        return state;
                    }
                }
                case DRAG_END: {
                    if(action.isDragging) {
                        //TODO: Clamp to within window
                        let dragPos = action.containerPos || action.dragPos;
                        let newPos:[number,number] = [
                            Math.max(dragPos[0] - iconMidWidth, 0),
                            Math.max(dragPos[1] - iconMidHeight, 0)
                        ];
                        let newIcon = Object.assign({}, icon, {
                            pos: snapToGrid(newPos),
                            container: action.container || icon.container
                        });
                        let newIcons = state.icons.slice();
                        let idx = state.icons.indexOf(icon);
                        newIcons.splice(idx, 1, newIcon);
                        return Object.assign({}, state, {icons: newIcons, ghostIcon: null});
                    } else {
                        return state;
                    }
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