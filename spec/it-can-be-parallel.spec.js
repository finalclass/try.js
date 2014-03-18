describe('it-can-be-parallel.spec', function () {

  var Try = require('../Try.js');
  var fs = require('fs');
  var domain = require('domain');

  it('is parallel', function (next) {
    Try
    (function () {
      fs.writeFile('tmp.tmp', 'a', Try.pause());
      fs.writeFile('tmp2.tmp', 'b', Try.pause());
    })
    ([Try.throwFirstArgumentInArray, function (write1, write2) {
      fs.readFile('tmp.tmp', Try.pause());
      fs.readFile('tmp2.tmp', Try.pause());
    }])
    ([Try.throwFirstArgumentInArray, function (read1, read2) {
      return read1 + read2;
    }])
    (function (concatenation) {
      expect(concatenation === 'ab' || concatenation === 'ba').toBeTruthy();
    })
    .catch(function (e) {
      console.log('e', e);
      next(e);
    })
    .finally(function () {
      fs.unlink('tmp.tmp', Try.pause());
      fs.unlink('tmp2.tmp', Try.pause());
    })
    (next);
  });

});