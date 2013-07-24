# Try.js

Examples are the best source of documentation - read spec/ directory content to find some of those.

## install

```bash
npm install try
```

## async usage (increment file

```js

var Try = require('try'),
    fs = require('fs');

new Try
    (function () {
        fs.readdir('./spec', this.pause());
    })
    (function (err, files) {
        if (err) { throw err; }
        var next = this.pause(files.length);

        files.forEach(function (file) {
            console.log('file', file);
            fs.readFile('./spec/' + file, next);
        });
    })
    (function () {
        return Array.prototype.map.call(arguments, function (args) {
            return args[1].toString();
        }).join('');
    })
    (function (result) {
        dirContent = result;
    })
    .catch(function (err) {
        console.log('catch', err.stack);
    })
    .run();
```

## sync usage

```js
var Try = require('try'),
    result = 0;

new Try
    (function () {
        return 1;
    })
    (function (n) {
        return n + 1;
    })
    (function (n) {
        return n * 2;
    })
    (function (n) {
        result = n;
    })();

expect(result).toBe(4);
```

## more examples

For more examples check out the spec/ directory