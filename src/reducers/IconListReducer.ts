import {Action} from "redux/index";

export interface IconState {
    id: number,
    pos: [number, number],
    imageStyle: any,
    title: string,
    componentType: string,
    args: any,
}

export interface IconListState {
    nextId: number,
    icons: IconState[],
    selectedId: number,
}

const initialState: IconListState = {
    nextId: 1,
    icons: [],
    selectedId: null
};

export function IconListReducer(state: IconListState = initialState, action: Action): IconListState {
    return state;
}