# Try.js

Examples are the best source of documentation - read spec/ directory content to find more of them.

## install

```bash
npm install try
```

## async usage (read directory content)

```js

var Try = require('try')
var fs = require('fs');

new Try
    (function () {
        //Try.pause() method returns a "resume" callback and pauses current execution.
        fs.readdir('./spec', Try.pause());
    })
    (Try.extractArguments(function (err, files) {
        if (err) { throw err; }
        var next = Try.pause(files.length);

        files.forEach(function (file) {
            console.log('file', file);
            fs.readFile('./spec/' + file, next);
        });
    }))
    (function () {
        return Array.prototype.map.call(arguments, function (args) {
            return args[1].toString();
        }).join('');
    })
    (Try.extractAeguments(function (result) {
        dirContent = result;
    }))
    .catch(function (err) {
        console.log('catch', err.stack);
    });
```

## sync usage

```js
var Try = require('try');
var result = 0;

new Try
    (function () {
        return 1;
    })
    (Try.extractArguments(function (n) {
        return n + 1;
    }))
    (Try.extractArguments(function (n) {
        return n * 2;
    }))
    (Try.extractArguments(function (n) {
        result = n;
    }));

expect(result).toBe(4);
```

## more examples

For more examples check out the spec/ directory