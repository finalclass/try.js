function Try(func) {
    var r = function (func) {
        if (arguments.length === 0 && r.proceed && r.stack.length > 0) {
            return r.run();
        }

        if (func instanceof Function) {
            r.stack.push(func);
        }

        return r;
    };

    //Copy methods
    for (var i in Try.fn) {
        r[i] = Try.fn[i];
    }
    r.stack = [];
    r.proceed = true;

    return func ? r(func) : r;
}

Try.fn = {
    pause: function (n) {
        var r = this;
        n = n || 1;

        if (n <= 0) {
            throw new TypeError('n must be greater then 0');
        }

        if (r.stack.length === 0) {
            return r;
        }

        r.proceed = false;
        var args = [];
        return function resume() {
            n -= 1;
            args.push(arguments);
            if (n === 0) {
                r.proceed = true;
                if (args.length === 1) {
                    return r.run(null, args[0]);
                } else {
                    return r.run(null, args);
                }
            }
            return r;
        };
    },
    catch: function (callback) {
        this.catchCallback = callback;
        return this;
    },
    finally: function (callback) {
        this.finallyCallback = callback;
        return this;
    },
    /**
     * Zdejmuje ze stosu jeśli nie podano argujmentu func, inaczej uruchamia funkcję i
     * zmienia r.lastResult
     *
     * @param {function} func
     */
    run: function (func, args) {
        //read arguments
        func = func || this.stack.shift();
        if (!func) {
            return this;
        }

        args = args || [this.lastResult];

        //run the function
        try {
            this.lastResult = func.apply(this, args);
            if (this.stack.length === 0 && this.finallyCallback instanceof Function) {
                this.finallyCallback(this.lastResult);
            } else {
                return this.proceed ? this.run() : this;
            }
        } catch (e) {
            if (this.catchCallback instanceof Function) {
                this.catchCallback(e);
            }
            if (this.finallyCallback instanceof Function) {
                this.finallyCallback(this.lastResult);
            }

            if (!(this.catchCallback instanceof Function) && !(this.finallyCallback instanceof Function)) {
                throw e;
            }
        }
        return this;
    }
};

if (module && module.exports) {
    module.exports = Try;
}
