describe('it-can-pause-many-times', function () {
  var Try = require('../Try.js'),
  fs = require('fs');

  it('it-can-pause-many-times', function (next) {
    Try
    (function () {
      fs.readdir(__dirname, Try.pause());
    })
    (Try.throwFirstArgument)
    (function (files) {
      for (var i = files.length; i -= 1;) {
        fs.readFile(__dirname + '/' + files[i], Try.pause());
      }
    })
    ([Try.throwFirstArgumentInArray, function(fileContentsArray) {
      expect(fileContentsArray.join('') !== '').toBeTruthy();
    }])
    .finally(function (err) {
      if (err) {
        console.log(err, err.stack);
      }
      next(err);
    });
  });
});