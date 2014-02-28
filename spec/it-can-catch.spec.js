describe('it-can-catch.spec', function () {

    var Try = require('../Try.js');

    it('can catch', function () {
        var cb = jasmine.createSpy('catch'),
            nextTry = jasmine.createSpy('nextTry'),
            throwError = function () {throw new Error();},
            noop = jasmine.createSpy('noop');

        new Try
            (noop)
            (noop)
            (noop)
            (throwError)
            (nextTry)
        .catch(cb)
        .run();

        expect(nextTry).not.toHaveBeenCalled();
        expect(cb).toHaveBeenCalled();
        expect(noop.calls.length).toBe(3);
    });

});