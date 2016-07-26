import * as redux from 'redux';
import {combinedReducer, MainState} from '../reducers';
import {Reducer} from "redux/index";
import {Store} from "redux/index";
import {Unsubscribe} from "redux/index";

declare var module: {hot:any};

/**
 * Wrapper for Redux's subscribers that debounces and only calls the update function once per requestAnimationFrame
 * @param store
 * @returns {({}&Store<any>&{subscribe: ((listener:()=>void)=>Unsubscribe)})|any}
 */
function reactRenderDebounceWrapper<S>(store:Store<S>):Store<S> {
    let currentListeners: (()=>void)[] = [];
    let nextListeners = currentListeners;
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }
    let nextAnimationFrame:number;
    let hasUpdates = true;
    function updateListeners() {
        try {
            hasUpdates = false;
            var listeners = currentListeners = nextListeners;
            for (var i = 0; i < listeners.length; i++) {
                listeners[i]();
            }
        } finally {
            //Pre-emptively request the next animation frame as well, just in case
            nextAnimationFrame = requestAnimationFrame(() => {
                if(hasUpdates) {
                    console.log("hit");
                    updateListeners();
                } else {
                    console.log("miss");
                    nextAnimationFrame = null;
                }
            });
        }
    }
    store.subscribe(() => {
        hasUpdates = true;
        if(!nextAnimationFrame) {
            nextAnimationFrame = requestAnimationFrame(updateListeners);
        }
    });
    function subscribe(listener:()=>void):Unsubscribe {
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }
        var isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe():void {
            if(!isSubscribed) return;

            ensureCanMutateNextListeners();
            isSubscribed = false;

            var index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
        }
    }

    return Object.assign({}, store, { subscribe });

}

export function configureStore(state?: MainState):Store<MainState> {
    const store = redux.createStore<MainState>(combinedReducer, state);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers');
            store.replaceReducer(nextReducer as Reducer<MainState>)
        })
    }

    return reactRenderDebounceWrapper(store)
}
