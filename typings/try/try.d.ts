declare module 'try' {

  interface ICallback {
    (...args:any[]):any;
  }

  interface ICallChain {
    (callbacks?:ICallback[]) : ITry;
    (callback?:ICallback) : ITry;
  }

  interface ITry extends ICallChain {
    then(callback:ICallback) : ITry;
    catch(callback:(err:Error)=>void) : ITry;
    finally(callback:ICallback) : ITry;
    run(func?:ICallback, args?:any[]) : ITry;
  }

  interface ITryStatic extends ICallChain {
    new(callback?:ICallback[]):ITry;
    new(callback?:ICallback):ITry;
    pause(n?:number):(...args:any[]) => ITry;
    throwFirstArgument(...args:any[]): void;
    throwFirstArgumentInArray(...args:any[]): void[];
  }

  var Try:ITryStatic;

  export = Try;
}
