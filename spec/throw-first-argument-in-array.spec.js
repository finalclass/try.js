describe('throw-first-argument-in-array.spec', function () {
  var Try = require('../Try.js');

  it('can catch many', function (next) {
    
    Try
    (function () {
      var resume1 = Try.pause();
      var resume2 = Try.pause();

      setTimeout(function () {
        resume1(new Error('err1'));
        resume2(new Error('err2'));
      });
    })
    ([Try.throwFirstArgumentInArray])
    .catch(function (err) {
      expect(err).toBeDefined();
      next();
    });

  });

});