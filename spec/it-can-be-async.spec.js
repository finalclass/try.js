describe('it-can-be-async.spec', function () {

  var Try = require('../Try.js');

  it('is async', function (next) {
    var result = 0;

    new Try
    (function () {
      result += 1;
      setTimeout(Try.pause(), 1);
    })
    (function () {
      result += 1;
      setTimeout(Try.pause(), 1);
    })
    (function () {
      result += 1;
      setTimeout(Try.pause(), 1);
    })
    .finally(function (err) {
      expect(result).toBe(3);
      next(err);
    });
  });

});