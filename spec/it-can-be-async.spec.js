describe('it-can-be-async.spec', function () {

  var Try = require('../Try.js');

  it('is async', function () {
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
    });

    waitsFor(function () {
      return result === 3;
    }, 'all functions to be executed', 20);

    runs(function () {
      expect(result).toBe(3);
    });
  });

});