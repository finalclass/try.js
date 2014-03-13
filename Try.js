function Try(func) {
  var r = function (func) {
    r.stack.push(func);
    return r.run();
  };
  
  for (var i in Try.fn) { 
    r[i] = Try.fn[i];
  }

  r.stack = [];
  r.pauseCounter = 0;
  r.argsStack = [];

  return r(func);
}

Try.throwFirstArgument = function (callback) {
  return function () {
    if (arguments[0][0]) {
      throw arguments[0][0];
    }
    return callback.apply(null, Array.prototype.slice.call(arguments[0], 1));
  }
};

Try.throwFirstArgumentInArray = function (callback) {
  return function () {
    return callback.apply(null, Array.prototype.map.call(arguments, function (args) {
      if (args[0]) {
        throw args[0];
      }
      return args.slice(1);
    }));
  }
};

Try.extractArguments = function (callback) {
  return function () {
    return callback.apply(this, arguments[0]);
  };
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
  runFunc: function (func) {
    try {
      var tryBefore = Try.currentTry;
      Try.currentTry = this;
      var last = func.apply(this, this.argsStack);

      if (this.pauseCounter > 0 && last !== undefined) {
        this.argsStack.push(last);
      } else if (typeof last === 'function' && last.stack) {
        Try.currentTry = this;
        last(Try.extractArguments(Try.pause()));
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
      this.argsStack = [err];
      this.runFunc(this.catchCallback, [err]);
      this.catchCallback = null;
    }
  },
  callFinallyCallbackIfPossible: function () {
    if (this.finallyCallback) {
      var err = this.error;
      this.error = null;
      this.argsStack = [err];
      this.runFunc(this.finallyCallback);
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