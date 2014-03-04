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

  it('can pass arguments async', function () {
    var result = '';

    new Try
    (function () {
      var resume = Try.pause();
      setTimeout(function () {
        resume('test');
      });
                //pass argument to the next function
              })
    (function (lastReturn) {
      result = lastReturn;
    });

    waitsFor(function () {
      return result !== '';
    }, 'finish the timeout', 20);

    runs(function () {
      expect(result).toBe('test');
    });
  });
});