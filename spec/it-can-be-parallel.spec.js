describe('it-can-be-parallel.spec', function () {

  var Try = require('../Try.js');
  var fs = require('fs');
  var domain = require('domain');

  it('is parallel', function () {
    var fileContents = '';
    var eat2Errors = function () {
      if (arguments[0][0] || arguments[1][0]) {
        throw [arguments[0][0], [1][0]];
      }
      return Array.prototype.slice.call(arguments);
    };
    var d = domain.create();

    d.on('error', function (err) {
    });

    d.run(function () {
      new Try
      (function () {
        var next = Try.pause(2);
        fs.writeFile('tmp.tmp', 'a', next);
        fs.writeFile('tmp2.tmp', 'b', next);
      })
      (eat2Errors)
      (function () {
        var next = Try.pause(2);
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
      })
      .finally(function (err) {
        var next = Try.pause(2);
        fs.unlink('tmp.tmp', next);
        fs.unlink('tmp2.tmp', next);
      });
    });

    

    waitsFor(function () {
      return fileContents !== '';
    }, 'files to write and read', 100);

    runs(function () {
      expect(fileContents === 'ab' || fileContents === 'ba').toBeTruthy();
    });
  });

});