import {ReducersMapObject, Reducer, combineReducers} from 'redux';
import {windowListReducer, WindowListState} from '../modules/Window/windowListReducer'
import {DragParams, DragReducer} from "../modules/Drag/dragReducer";
import {IconListReducer, IconListState} from "../modules/Icon/iconListReducer";

const reducers:ReducersMapObject = {
    dragParams: DragReducer,
    windowList: windowListReducer,
    iconList: IconListReducer
};

export interface MainState {
    dragParams: DragParams,
    windowList: WindowListState,
    iconList: IconListState
}

export const combinedReducer: Reducer<MainState> = combineReducers<MainState>(reducers);
