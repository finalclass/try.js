describe('basic-use-case', function () {
  var Try = require('../Try.js');

  it('can pass arguments sync', function () {
    new Try
    (function () {
                //pass argument to the next function
                return 'test';
              })
    (function (lastReturn) {
      expect(lastReturn).toBe('test');
    });
  });

  it('does not need new operator', function () {
    Try(function () {
      return 'test';
    })
    (function (lastReturn) {
      expect(lastReturn).toBe('test');
    })
  });

  it('can pass arguments async', function (next) {
    Try
    (function () {
      var resume = Try.pause();
      setTimeout(function () {
        resume('works'); //pass argument to the next function
      });
    })
    (function (works) {
      expect(works).toBe('works');
      next();
    });
  });

});