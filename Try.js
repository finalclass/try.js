var Try = (function () {
  'use strict';

  function Try(func) {
    var r = function (func) {
      if (func) {
        r.addFunc(func);
      }
      return r.run();
    };
    
    for (var i in Try.fn) { 
      r[i] = Try.fn[i];
    }

    r.callStack = [];
    r.pauseCounter = 0;
    r.argsStack = [];

    return r(func);
  }

  Try.throwFirstArgument = function () {
    if (arguments[0]) {
      throw arguments[0];
    }
    return arguments[1];
  };

  Try.throwFirstArgumentInArray = function () {
    return Array.prototype.map.call(arguments, function (args) {
      if (args[0]) {
        throw args[0];
      }
      return args.slice(1);
    });
  };

  Try.currentTry = null; //is being set in run function

  Try.pause = function (n) {
    var r = Try.currentTry;
    r.pauseCounter += n || 1;
    return function resume() {
      var args = Array.prototype.slice.call(arguments);
      setTimeout(function () {
        r.pauseCounter -= 1;
        r.argsStack.push(args);
        if (r.pauseCounter === 0) {
          r.run();
        }
      });
      return arguments[0];
    };
  }

  Try.fn = {
    addFunc: function (func, type) {
      this.callStack.push({
        type: type || 'then',
        func: func
      });
    },
    runFunc: function (funcDescription) {
      try {
        var tryBefore = Try.currentTry;
        var last;
        Try.currentTry = this;
        if (typeof funcDescription.func === 'function') {
          last = funcDescription.func.apply(this, this.argsStack[this.argsStack.length - 1]);
        } else {
          last = this.argsStack;
          for (var i = 0; i < funcDescription.func.length; i += 1) {
            last = funcDescription.func[i].apply(this, last);
          }
        }

        if (this.pauseCounter > 0 && last !== undefined) {
          this.argsStack.push(last);
        } else if (typeof last === 'function' && last.callStack) {
          Try.currentTry = this;
          this.argsStack = [];
          last(Try.pause());
        } else {
          this.argsStack = last ? [[last]] : [];
        }
        
        Try.currentTry = tryBefore;
      } catch (e) {
        this.error = e;
        this.asyncThrowError();
      }
    },
    asyncThrowError: function () {
      var r = this;
      setTimeout(function () {
        if (r.error) {
          throw r.error;
        }
      });
    },
    catch: function (callback) {
      this.addFunc(callback, 'catch');
      return this.run();
    },
    finally: function (callback) {
      this.addFunc(callback, 'finally');
      return this.run();
    },
    run: function () {
      if (this.pauseCounter > 0) {
        return this;
      }

      var func = this.callStack.shift();
      if (!func) {
        return this;
      }

      if (func.type === 'then' && !this.error) {
        this.runFunc(func);
      } else if (func.type === 'catch' && this.error) {
        this.argsStack = [[this.error]];
        this.error = null;
        this.runFunc(func);
      } else if (func.type === 'finally') {
        if (this.error) {
          this.argsStack = [[this.error]];
          this.error = null;
        }
        this.runFunc(func);
      }

      return this.run();
    }
  };

  return Try;
}());

//nodejs support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Try;
}