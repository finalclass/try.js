describe('it-can-be-parallel.spec', function () {

    var Try = require('../Try.js'),
        fs = require('fs');

    it('is parallel', function () {
        var fileContents = '',
            eat2Errors = function (args) {
                if (arguments[0][0] || arguments[1][0]) {
                    throw [arguments[0][0], [1][0]];
                }
                return Array.prototype.slice.call(arguments);
            };

        new Try
        (function () {
            var next = this.pause(2);
            fs.writeFile('tmp.tmp', 'a', next);
            fs.writeFile('tmp2.tmp', 'b', next);
        })
            (eat2Errors)
        (function () {
            var next = this.pause(2);
            fs.readFile('tmp.tmp', next);
            fs.readFile('tmp2.tmp', next);
        })
            (eat2Errors)
        (function (results) {
            return results.map(function (item) {
                return item[1].toString();
            });
        })
        (function (files) {
            fileContents = files.join('');
        })
            .catch(function (err) {
                console.log(err.stack);
            })
            .finally(function () {
                var next = this.pause(2);
                fs.unlink('tmp.tmp', next);
                fs.unlink('tmp2.tmp', next);
            })
            .run();

        waitsFor(function () {
            return fileContents !== '';
        }, 'files to write and read', 100);

        runs(function () {
            expect(fileContents === 'ab' || fileContents === 'ba').toBeTruthy();
        });
    });

});