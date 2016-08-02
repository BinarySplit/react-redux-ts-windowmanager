import * as redux from 'redux';
import {combinedReducer, MainState} from './appReducer';
import {Reducer, Store} from "redux/index";
import {debounceReduxUpdate} from "../utils/debounceReduxUpdate";

declare var module: {hot:any};

export function configureStore(state?: MainState):Store<MainState> {
    const store = redux.createStore<MainState>(combinedReducer, state);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./appReducer', () => {
            const nextReducer = require('./appReducer');
            store.replaceReducer(nextReducer as Reducer<MainState>)
        })
    }

    return debounceReduxUpdate(store);
}
