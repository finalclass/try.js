describe('multi-catch-and-finally', function () {
  var Try = require('../Try.js');

  it('can have many finally stmts', function () {
    var spy1 = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    
    Try
    (function () {
      
    })
    .finally(spy1)
    .finally(spy2);

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('can have many catch stmts', function () {
    var spy1 = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    
    Try
    (function () {
      throw new Error();
    })
    .catch(function () {
      spy1();
      throw new Error();
    })
    .catch(function () {
      spy2();
    });

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

});