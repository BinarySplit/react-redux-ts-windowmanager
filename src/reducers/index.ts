
import {ReducersMapObject, Action} from 'redux';
import './WindowReducer'
import {WindowListReducer, WindowListState} from './WindowListReducer'
import {DragParams, DragReducer} from "./DragReducer";

const reducers:ReducersMapObject = {
    windows: WindowListReducer
};

export interface MainState {
    windows: WindowListState,
    dragParams: DragParams
}
const initialState:MainState = {
    windows: undefined,
    dragParams: null
};

//export const combinedReducer: Reducer<MainState> = combineReducers<MainState>(reducers);

export function combinedReducer(state: MainState = initialState, action: Action): MainState {
    return Object.assign({}, state, {
        windows: WindowListReducer(state.windows, action),
        dragParams: DragReducer(state.dragParams, action)
    });
}