import {DragAction, dragStart, DRAG, DRAG_START, DRAG_END} from "./Drag";
import {Action} from "redux/index";

//Consts
export const MOVE_ICON = "MOVE_ICON";

//Interfaces
export interface MoveIconActionArgs {
    iconId: number,
    initialPos: [number, number]
}
export type MoveIconAction = DragAction & MoveIconActionArgs;

export interface SelectIconAction extends Action {
    iconId: number
}

//Action Creators
export function moveIcon(iconId: number, initialPos: [number, number], event: __React.MouseEvent): MoveIconAction {
    return dragStart(event, MOVE_ICON, {iconId, initialPos});
}

//Utils
export function isMoveIconAction(action: Action): action is MoveIconAction {
    return (action.type == DRAG_START || action.type == DRAG || action.type == DRAG_END)
        && (action as DragAction).dragType == MOVE_ICON;
}