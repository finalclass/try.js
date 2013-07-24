describe('basic-use-cases', function () {

    var Try = require('../Try.js');

    it('is sync', function () {
        var result = 0;

        new Try
        (function () {
            return 1;
        })
        (function (n) {
            return n + 1;
        })
        (function (n) {
            return n + 1;
        })
        (function (n) {
            result = n;
        })();

        expect(result).toBe(3);
    });

});