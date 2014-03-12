describe('multiplie tries', function () {
  var Try = require('../Try.js');

  it('can merge tries sync', function (next) {
    Try
    (function () {
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

  it('can merge tries async', function (next) {
   Try
   (function () {
     Try
     (function () {
       var resume = Try.pause();
       setTimeout(function () {
         resume('works');
       }, 200);
     })
     (Try.pause());
   })
   (function (works) {
    expect(works).toBe('works');
   })
   (function () {
     next();
   });
 });

});