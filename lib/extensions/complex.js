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
exports = __contracts.makeContractsExports("extensions/complex.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/complex.coffee");
};
(function() {
  var Complex, binOps, isComplex, makeComplex, secret, unaryOps;

  secret = {};

  unaryOps = {
    '-': function(r, i) {
      return makeComplex(Proxy.dispatchUnary('-', r, function() { return -r; }), Proxy.dispatchUnary('-', i, function() { return -i; }));
    },
    'typeof': function(r, i) {
      return 'number';
    }
  };

  binOps = {
    '+': function(r1, i1, r2, i2) {
      return makeComplex(Proxy.dispatchBinary('+', r1, r2, function() { return r1 + r2;}), Proxy.dispatchBinary('+', i1, i2, function() { return i1 + i2;}));
    },
    '*': function(r1, i1, r2, i2) {
      return makeComplex(Proxy.dispatchBinary('-', Proxy.dispatchBinary('*', r1, r2, function() { return r1 * r2;}), Proxy.dispatchBinary('*', i1, i2, function() { return i1 * i2;}), function() { return Proxy.dispatchBinary('*', r1, r2, function() { return r1 * r2;}) - Proxy.dispatchBinary('*', i1, i2, function() { return i1 * i2;});}), Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', i1, r2, function() { return i1 * r2;}), Proxy.dispatchBinary('*', r1, i2, function() { return r1 * i2;}), function() { return Proxy.dispatchBinary('*', i1, r2, function() { return i1 * r2;}) + Proxy.dispatchBinary('*', r1, i2, function() { return r1 * i2;});}));
    },
    '===': function(r1, i1, r2, i2) {
      return Proxy.dispatchBinary('&&', (Proxy.dispatchBinary('===', r1, r2, function() { return r1 === r2;})), (Proxy.dispatchBinary('===', i1, i2, function() { return i1 === i2;})), function() { return (Proxy.dispatchBinary('===', r1, r2, function() { return r1 === r2;})) && (Proxy.dispatchBinary('===', i1, i2, function() { return i1 === i2;}));});
    }
  };

  Complex = (function(x) {
    return isComplex(x);
  }).toContract();

  makeComplex = __contracts.guard(__contracts.fun([Num, Num], Complex, {}),function(r, i) {
    var h;
    h = {
      real: r,
      imag: i,
      unary: function(o) {
        return unaryOps[o](r, i);
      },
      left: function(o, right) {
        h = Proxy.unProxy(secret, right);
        if (Proxy.dispatchTest(h)) {
          return binOps[o](r, i, h.real, h.imag);
        } else {
          return binOps[o](r, i, y, 0);
        }
      },
      right: function(o, left) {
        return binOps[o](left, 0, r, i);
      },
      test: function() {
        return true;
      },
      getPropertyDescriptor: function(name) {
        return;
      }
    };
    return Proxy.create(h, null, secret);
  });

  exports.makeComplex = makeComplex;

  exports.isComplex = __contracts.guard(__contracts.fun([Any], Bool, {}),isComplex = function(x) {
    if (Proxy.dispatchTest(Proxy.unProxy(secret, x))) {
      return true;
    } else {
      return false;
    }
  });

  exports.i = makeComplex(0, 1);

}).call(this);
}).call(this);
