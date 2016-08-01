import * as React from "react";

function shallowEqualArray(a: any[], b: any[]): boolean {
    if(a == b) return true;
    if(a == null || b == null) return false;
    if(a.length != b.length) return false;
    for(let i = 0; i < a.length; i++) {
        if(a[i] != b[i]) return false;
    }
    return true;
}

export function memoize<TFn extends (...args: any[]) => any>(fn: TFn): TFn {
    let lastArgs: any[];
    let lastReturn: any;
    return function(...args: any[]) {
        if(shallowEqualArray(args, lastArgs)) {
            return lastReturn;
        } else {
            let ret = fn.apply(this, args);
            lastArgs = args;
            return lastReturn = ret;
        }
    } as TFn;
}

export function memoizeMethod(target: any, key: string, value: any) {
    //Store the memoized method on a unique symbol on each instance
    let sym = Symbol("Memoized " + (target.name || "method"));
    return {value: function() {
        if(!this[sym])
            this[sym] = memoize(value.value);
        return this[sym].apply(this, arguments);
    }};
}

export function memoizeWithKey<TFn extends (key: string, ...args: any[]) => any>(fn: TFn): TFn {
    let lastArgs: {[key:string]: any[]} = {};
    let lastReturns: {[key:string]: any} = {};
    return function(key: string, ...args: any[]) {
        if(shallowEqualArray(args, lastArgs[key])) {
            return lastReturns[key];
        } else {
            let ret = fn.apply(this, [key].concat(args));
            lastArgs[key] = args;
            return lastReturns[key] = ret;
        }
    } as TFn;
}

export function memoizeMethodWithKey(target: any, key: string, value: any) {
    //Store the memoized method on a unique symbol on each instance
    let sym = Symbol("Memoized " + (target.name || "method"));
    return {value: function() {
        if(!this[sym])
            this[sym] = memoizeWithKey(value.value);
        return this[sym].apply(this, arguments);
    }};
}
