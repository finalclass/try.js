describe('it-works-great-with-node.spec', function () {

  var Try = require('../Try.js');
  var fs = require('fs');

  it('is a good idea for node style callbacks', function (next) {
    Try
    (function () {
      fs.writeFile('tmp.tmp', 'Test', Try.pause());
    })
    (Try.throwFirstArgument)
    (function () {
      fs.exists('tmp.tmp', Try.pause());
    })
    (function (exists) {
      expect(exists).toBeTruthy();
      fs.readFile('tmp.tmp', Try.pause());
    })
    (Try.throwFirstArgument)
    (function (file) {
      expect(file.toString()).toBe('Test');
    })
    .finally(function (err) {
      fs.unlink('tmp.tmp', Try.pause());
      if (err) {
        next(err);
      }
    })
    (function (err) {
      next(err);
    });
  });

});