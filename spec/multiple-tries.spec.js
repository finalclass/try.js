describe('basic-use-case', function () {
  var Try = require('../Try.js');

  it('can merge tries', function (next) {
    Try(function () {
      Try(function () {
        return 'works';
      })
      (Try.pause());
    })
    (function (works) {
      expect(works).toBe('works');
    })
    (function () {
      next();
    })
    .catch(next);
  });

});