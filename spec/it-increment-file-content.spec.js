describe('it-increment-file-content.spec', function () {

    var Try = require('../Try.js'),
        fs = require('fs');

    it('it-increment-file-content.spec', function () {
        var dirContent = '';

        new Try
            (function () {
                fs.readdir('./spec', this.pause());
            })
            (function (err, files) {
                if (err) { throw err; }
                var next = this.pause(files.length);

                files.forEach(function (file) {
                    fs.readFile('./spec/' + file, next);
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