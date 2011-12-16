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

__old_exports = exports;
exports = __contracts.makeContractsExports("extensions/function-operators.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/function-operators.coffee");
};
(function() {
  var df, secret;
  var __slice = Array.prototype.slice;

  secret = {};

  df = function(f, fakeArity, partialArgs) {
    var call, h;
    if (Proxy.dispatchTest(partialArgs == null)) partialArgs = [];
    h = {
      partialArgs: partialArgs,
      f: f,
      get: function(r, name) {
        if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('===', name, 'length', function() { return name === 'length';}), (fakeArity != null), function() { return Proxy.dispatchBinary('===', name, 'length', function() { return name === 'length';}) && (fakeArity != null);}))) {
          return fakeArity;
        } else {
          return f[name];
        }
      },
      left: function(o, r) {
        if (Proxy.dispatchTest(Proxy.dispatchBinary('===', o, '+', function() { return o === '+';}))) {
          return df((function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return f(r.apply(this, args));
          }), r.length);
        }
      }
    };
    call = function() {
      var args, flen;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      flen = Proxy.dispatchTest(fakeArity != null) ? fakeArity : f.length;
      if (Proxy.dispatchTest(Proxy.dispatchBinary('<', (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), flen, function() { return (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})) < flen;}))) {
        return df(f, null, h.partialArgs.concat(args));
      } else if (Proxy.dispatchTest(Proxy.dispatchBinary('>', (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), flen, function() { return (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})) > flen;}))) {
        throw Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}), " but was expecting ", function() { return Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}) + " but was expecting ";}), f.length, function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}), " but was expecting ", function() { return Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}) + " but was expecting ";}) + f.length;});
      } else {
        return f.apply(this, h.partialArgs.concat(args));
      }
    };
    return Proxy.createFunction(h, call, call);
  };

  exports.deffun = function(f) {
    return df(f, null);
  };

}).call(this);
}).call(this);
