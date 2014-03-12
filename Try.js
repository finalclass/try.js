function Try(func) {
  var r = function (func) {
    r.stack.push(func);
    return r.run();
  };
  //copy methods
  for (var i in Try.fn) { 
    r[i] = Try.fn[i];
  }
  r.stack = [];
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
    return args[1];
  });
};

Try.currentTry = null; //is being set in run function

Try.pause = function (n) {
  var r = Try.currentTry;
  r.pauseCounter += n || 1;
  return function resume() {
    var args = arguments;
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
  runFunc: function (func) {
    try {
      var tryBefore = Try.currentTry;
      Try.currentTry = this;
      var last = func.apply(this, this.argsStack.length === 1 ? this.argsStack[0] : this.argsStack);
      if (this.pauseCounter > 0 && last !== undefined) {
        this.argsStack.push(last);
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
    if (err && this.catchCallback) {
      this.error = null;
      this.runFunc(this.catchCallback, [err]);
      this.catchCallback = null;
    }
  },
  callFinallyCallbackIfPossible: function () {
    if (this.finallyCallback) {
      var err = this.error;
      this.error = null;
      this.runFunc(this.finallyCallback, [err]);
      this.finallyCallback = null;
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
    this.catchCallback = callback;
    return this.run();
  },
  finally: function (callback) {
    this.finallyCallback = callback;
    return this.run();
  },
  run: function () {
    this.callCatchCallbackIfPossible();

    if (this.pauseCounter > 0 || (this.stack.length === 0 && !this.finallyCallback)) {
      return this;
    }
    
    var func = this.stack.shift();

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