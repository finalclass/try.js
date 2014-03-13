describe('it-increment-file-content.spec', function () {

  var Try = require('../Try.js');
  var fs = require('fs');

  it('it-increment-file-content.spec', function (next) {

    Try
    (function () {
      fs.readdir(__dirname, Try.pause());
    })
    (Try.throwFirstArgument)
    (function (files) {
      var next = Try.pause(files.length);
      files.forEach(function (file) {
        fs.readFile(__dirname + '/' + file, next);
      });
    })
    ([Try.throwFirstArgumentInArray, function () {
      return Array.prototype.join.call(arguments, '');
    }])
    (function (result) {
      expect(result !== '').toBeTruthy();
    })
    .finally(next);

  });

});