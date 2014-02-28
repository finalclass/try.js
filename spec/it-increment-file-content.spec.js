describe('it-increment-file-content.spec', function () {

    var Try = require('../Try.js'),
        fs = require('fs');

    it('it-increment-file-content.spec', function () {
        var dirContent = '';

        new Try
            (function () {
                fs.readdir(__dirname, Try.pause());
            })
            (function (err, files) {
                if (err) { throw err; }
                var next = Try.pause(files.length);

                files.forEach(function (file) {
                    fs.readFile(__dirname + '/' + file, next);
                });
            })
            (function (err, data) {
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

        waitsFor(function () {
            return dirContent !== '';
        }, 'read all files', 100);

        runs(function () {
            expect(dirContent !== '').toBeTruthy();
        });
    });

});