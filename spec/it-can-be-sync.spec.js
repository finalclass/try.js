describe('it-can-be-sync.spec', function () {

  var Try = require('../Try.js');

  it('is sync', function () {
    var result = 0;

    new Try
    (function () {
      return 1;
    })
    (Try.extractArguments(function (n) {
      return n + 1;
    }))
    (Try.extractArguments(function (n) {
      return n * 2;
    }))
    (Try.extractArguments(function (n) {
      result = n;
    }));

    expect(result).toBe(4);
  });

});