describe('it-can-catch.spec', function () {

  var Try = require('../Try.js');

  it('can catch', function () {
    var cb = jasmine.createSpy('catch');
    var nextTry = jasmine.createSpy('nextTry');
    var throwError = function () {throw new Error('error thrown');};
    var noop = jasmine.createSpy('noop');

    new Try
    (noop)
    (noop)
    (noop)
    (throwError)
    (nextTry)
    .catch(cb);
      
    expect(nextTry).not.toHaveBeenCalled();
    expect(cb).toHaveBeenCalled();
    expect(noop.calls.length).toBe(3);
  });

});