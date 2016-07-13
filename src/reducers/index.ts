
import {combineReducers, ReducersMapObject, Reducer, Action} from 'redux';
import './WindowReducer'
import WindowListReducer from './WindowListReducer'
import DragReducer from './DragReducer'
import {MainState} from "../stores/index";

const reducers:ReducersMapObject = {
    windows: WindowListReducer
};

//export const combinedReducer: Reducer<MainState> = combineReducers<MainState>(reducers);

export function combinedReducer(state: MainState, action: Action): MainState {
    return Object.assign({}, state, {
        windows: WindowListReducer(state.windows, action),
        actions: state.actions.concat(JSON.stringify(action)),
        dragParams: DragReducer(state.dragParams, action)
    });
}