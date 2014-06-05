declare module 'try' {
  
  function tryjs(callback?:{(...args):any}[]) : tryjs.ITry;
  function tryjs(callback?:(...args)=>any) : tryjs.ITry;

  module tryjs {
    function pause(n?:number) : () => ITry;
    function throwFirstArgument(...args) : void;
    function throwFirstArgumentInArray(...args) : void[];

    interface ITry {
      (callback?:{(...args):any}[]) : ITry;
      (callback?:(...args)=>any) : ITry;
      then(callback:(...args)=>void) : ITry;
      catch(callback:(err:Error)=>void) : ITry;
      finally(callback:(...args)=>void) : ITry;
      run(func?:(...args)=>void, args?:any[]) : ITry;    
    }
  }

  export = tryjs;
}