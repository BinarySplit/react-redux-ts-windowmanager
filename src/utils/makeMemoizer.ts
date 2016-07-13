
function compareArrays(a: any[], b: any[]): boolean {
    if(a == b) return true;
    if(a == null || b == null) return false;
    if(a.length != b.length) return false;
    for(let i = 0; i < a.length; i++) {
        if(a[i] != b[i]) return false;
    }
    return true;
}

export interface Memoizer {
    <TReturn>(token:string, args: any[], fn: (...args:any[])=>TReturn): TReturn;
}

export function makeMemoizer(): Memoizer {
    let cachedArgs: {[key:string]: any[]} = {};
    let cachedReturns: {[key:string]: any} = {};

    return function<TReturn>(token:string, args: any[], fn: (...args:any[]) => TReturn): TReturn {
        if(compareArrays(cachedArgs[token], args))
            return cachedReturns[token] as TReturn;

        let ret = fn.apply(null, args);
        cachedArgs[token] = args;
        return cachedReturns[token] = ret;
    }
}