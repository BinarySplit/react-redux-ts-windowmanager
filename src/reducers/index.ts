
import {ReducersMapObject, Reducer, combineReducers} from 'redux';
import './WindowReducer'
import {WindowListReducer, WindowListState} from './WindowListReducer'
import {DragParams, DragReducer} from "./DragReducer";
import {IconListReducer, IconListState} from "./IconListReducer";

const reducers:ReducersMapObject = {
    windows: WindowListReducer,
    dragParams: DragReducer,
    iconList: IconListReducer
};

export interface MainState {
    windows: WindowListState,
    dragParams: DragParams,
    iconList: IconListState
}

export const combinedReducer: Reducer<MainState> = combineReducers<MainState>(reducers);
