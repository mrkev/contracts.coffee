(function() {var __contracts, Undefined, Null, Num, Bool, Str, Odd, Even, Pos, Nat, Neg, Self, Any, None, __old_exports, __old_require;
if (typeof(window) !== 'undefined' && window !== null) {
  __contracts = window.Contracts;
} else {
  __contracts = require('contracts.js');
}
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

if (typeof(exports) !== 'undefined' && exports !== null) {
  __old_exports = exports;
  exports = __contracts.exports("test/webtest/adder_module.coffee", __old_exports)
}
if (typeof(require) !== 'undefined' && require !== null) {
  __old_require = require;
  require = function(module) {
    module = __old_require.apply(this, arguments);
    return __contracts.use(module, "test/webtest/adder_module.coffee");
  };
}
(function() {
  var exports;

  exports = Contracts.exports("adder_module");

  exports.add = __contracts.guard(__contracts.fun([Num], Pos, {}),function(x) {
    return x + 10;
  });

  window.Adder = exports;

}).call(this);
}).call(this);
