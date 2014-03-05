function Try(func) {
  var r = function (func) {
    if (typeof func === 'function') {
      r.stack.push(func);
    }
    return r.run();
  };
  //copy methods
  for (var i in Try.fn) { 
    r[i] = Try.fn[i];
  }
  r.stack = [];
  r.proceed = true;
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
  if (r.pauseCounter <= 0) {
    throw new TypeError('n must be greater then 0');
  }

  r.proceed = false;
  return function resume() {
    var args = r.argsStack;
    args.push(arguments);
    r.pauseCounter -= 1;
    if (r.pauseCounter === 0) {
      r.argsStack = [];
      r.proceed = true;
      if (args.length === 1) {
        return r.run(args[0]);
      }
      return r.run(args);
    }
    return r;
  };
}

Try.fn = {
  callCatchCallbackIfPossible: function () {
    var err = this.error;
    if (err && this.catchCallback) {
      this.error = null;
      this.catchCallback.call(this, err);
      this.catchCallback = null;
    }
  },
  callFinallyCallbackIfPossible: function () {
    if (this.finallyCallback) {
      var err = this.error;
      this.error = null;
      this.finallyCallback.call(this, err);
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
  run: function (args) {
    Try.currentTry = this;
    this.callCatchCallbackIfPossible();

    if (!this.proceed || (this.stack.length === 0 && !this.finallyCallback)) {
      return this;
    }

    func = this.stack.shift();
    args = args || [this.lastResult];

    if (!func) {
      this.callFinallyCallbackIfPossible();
      return this.run();
    }

    if (this.error) { //if there was an error, abandon current `func` and go further (wait for catch)
      return this;
    }
    
    //run the function
    try { 
      this.lastResult = func.apply(this, args);
    } catch (e) {
      this.error = e;
      this.asyncThrowError();
    }

    return this.run();
  }
};

//nodejs support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Try;
}