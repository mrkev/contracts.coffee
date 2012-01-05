((function(cb) { 
  if (typeof(define) === 'function' && define.amd) {
    require(['contracts'], cb);
  } else if (typeof(require) === 'function') {
    cb(require('contracts.js'));
  } else {
    cb(window.contracts);
  }
})(function(__contracts) {var Undefined, Null, Num, Bool, Str, Odd, Even, Pos, Nat, Neg, Self, Any, None, __old_exports, __old_require;

Undefined =  __contracts.Undefined;
Null      =  __contracts.Null;
Num       =  __contracts.Num;
Bool      =  __contracts.Bool;
Str       =  __contracts.Str;
Odd       =  __contracts.Odd;
Even      =  __contracts.Even;
Pos       =  __contracts.Pos;
Nat       =  __contracts.Nat;
Neg       =  __contracts.Neg;
Self      =  __contracts.Self;
Any       =  __contracts.Any;
None      =  __contracts.None;

/*
if (typeof(exports) !== 'undefined' && exports !== null) {
  __old_exports = exports;
  exports = __contracts.exports("test/webtest/scripts/modules/adder_user.coffee", __old_exports)
}
if (typeof(require) !== 'undefined' && require !== null) {
  __old_require = require;
  require = function(module) {
    module = __old_require.apply(this, arguments);
    return __contracts.use(module, "test/webtest/scripts/modules/adder_user.coffee");
  };
}
*/
(function() {

  define(["modules/adder_module"], function(adder) {
    var add;
    add = adder.add;
    return {
      init: function() {
        return add("foo");
      }
    };
  });

}).call(this);
}));
