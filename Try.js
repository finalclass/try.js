function Try(func) {
  var r = function (func) {
    if (func) {
      r.thenStack.push(func);
    }
    return r.run();
  };
  
  for (var i in Try.fn) { 
    r[i] = Try.fn[i];
  }

  r.thenStack = [];
  r.catchStack = [];
  r.finallyStack = [];
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
  runFunc: function (funcDescription) {
    try {
      var tryBefore = Try.currentTry;
      var last;
      Try.currentTry = this;
      if (typeof funcDescription === 'function') {
        last = funcDescription.apply(this, this.argsStack[0]);
      } else {
        last = this.argsStack;
        for (var i = 0; i < funcDescription.length; i += 1) {
          last = funcDescription[i].apply(this, last);
        }
      }

      if (this.pauseCounter > 0 && last !== undefined) {
        this.argsStack.push(last);
      } else if (typeof last === 'function' && last.thenStack) {
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
  callCatchCallbackIfPossible: function () {
    var err = this.error;
    if (err && this.catchStack.length > 0) {
      this.error = null;
      this.argsStack = [[err]];
      this.runFunc(this.catchStack.shift());
    }
  },
  callFinallyCallbackIfPossible: function () {
    if (this.finallyStack.length > 0) {
      var err = this.error;
      this.error = null;
      this.argsStack = [[err]];
      this.runFunc(this.finallyStack.shift());
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
    this.catchStack.push(callback);
    return this.run();
  },
  finally: function (callback) {
    this.finallyStack.push(callback);
    return this.run();
  },
  run: function () {
    this.callCatchCallbackIfPossible();

    if (this.pauseCounter > 0 || (this.thenStack.length === 0 && this.finallyStack.length === 0)) {
      return this;
    }
    
    var func = this.thenStack.shift();
    if (!func) {
      this.callFinallyCallbackIfPossible();
      return this.run();
    }

    if (this.error) { //if there was an error, abandon current `func` and go further (wait for catch)
      return this;
    }

    this.runFunc(func);
    return this.run();
  }
};

//nodejs support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Try;
}