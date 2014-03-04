describe('it-can-pause-many-times', function () {
  var Try = require('../Try.js'),
  fs = require('fs');

  it('it-can-pause-many-times', function () {
    var fileContents = '';

    new Try
    (function () {
      fs.readdir(__dirname, Try.pause());
    })
    (Try.throwFirstArgument)
    (function (files) {
      for (var i = files.length; i -= 1;) {
        fs.readFile(__dirname + '/' + files[i], Try.pause());
      }
    })
    (Try.throwFirstArgumentInArray)
    (function(fileContentsArray) {
      fileContents = fileContentsArray.join('');
    })
    .catch(function (err) {
      console.log(err.stack);
    });

    waitsFor(function () {
      return fileContents !== '';
    }, 'files to be read', 100);

    runs(function () {
      expect(fileContents !== '').toBeTruthy();
    });

  });
});