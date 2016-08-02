
import {ReducersMapObject, Reducer, combineReducers} from 'redux';
import './WindowReducer'
import {WindowListReducer, WindowListState} from './WindowListReducer'
import {DragParams, DragReducer} from "./DragReducer";
import {IconListReducer, IconListState} from "./IconListReducer";

const reducers:ReducersMapObject = {
    dragParams: DragReducer,
    windowList: WindowListReducer,
    iconList: IconListReducer
};

export interface MainState {
    dragParams: DragParams,
    windowList: WindowListState,
    iconList: IconListState
}

export const combinedReducer: Reducer<MainState> = combineReducers<MainState>(reducers);
