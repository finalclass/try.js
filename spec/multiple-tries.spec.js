describe('multiplie tries', function () {
  var fs = require('fs');
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

  it('can merge by return statement', function (next) {
    Try
    (function () {
      return Try(function () {
        var resume = Try.pause();
        setTimeout(function () {
          resume('works');
        });
      });
    })
    (function (works) {
      expect(works).toBe('works');
      next();
    });
  });

  it('can merge by return in real life situation', function (next) {
    Try
    (function () {
      return Try
      (function () {
        fs.writeFile('tmp.tmp', 'ABC', Try.pause());
      })
      (function () {
        fs.unlink('tmp.tmp', Try.pause());
      });
    })
    (function () {
      fs.exists('tmp.tmp', Try.pause());
    })
    (function (doesExists) {
      expect(doesExists === false).toBeTruthy();
      next();
    });
  });

  it('can merge by return', function (next) {
    
    Try
    (function () {
      return 'a';
    })
    (function () {
      return Try
      (function () {
        return 'b'
      });
    })
    (function (result) {
      expect(result).toBe('b');
      next();
    });

  });

});