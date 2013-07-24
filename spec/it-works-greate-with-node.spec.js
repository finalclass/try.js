describe('basic-use-cases', function () {

    var Try = require('../Try.js'),
        fs = require('fs');

    it('is a good idea for node style callbacks', function () {
        var fExists = false,
            readData = '',
            eatError = function (err, data) {
                if (err) { throw err; }
                return data
            };

        new Try
            (function () {
                fs.writeFile('tmp.tmp', 'Test', this.pause());
            })
            (eatError)
            (function () {
                fs.exists('tmp.tmp', this.pause());
            })
            (function (exists) {
                fExists = exists;
                if (exists) {
                    fs.readFile('tmp.tmp', this.pause());
                } else {
                    throw new Error('File does not exists');
                }
            })
            (eatError)
            (function (fileContent) {
                readData = fileContent.toString();
            })
            .catch(function (err) {
                console.log(err.stack);
            })
            .finally(function () {
                fs.unlink('tmp.tmp', this.pause());
            })
            .run();

        waitsFor(function () {
            return readData !== '';
        }, 'write and read', 50);

        runs(function () {
            expect(readData).toBe('Test');
            expect(fExists).toBe(true);
        });
    });

});