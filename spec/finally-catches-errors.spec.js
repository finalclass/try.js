describe('finally-catches-errors.spec', function () {
  var Try = require('../Try.js');
  
  it('uses finally to catch errors', function (next) {
    Try
    (function () {
      throw new Error('abc');
    })
    .finally(function (err) {
      expect(err.message).toBe('abc');
      next();
    });
  });

});