# Try.js

Examples are the best source of documentation - read spec/ directory content to find some of those.

## install

```bash
npm install try
```

## usage

```js
var Try = require('try');

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