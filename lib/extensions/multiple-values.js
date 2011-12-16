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
exports = __contracts.makeContractsExports("extensions/multiple-values.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/multiple-values.coffee");
};
(function() {
  var binOps, bind, secret, unaryOps, values;
  var __slice = Array.prototype.slice;

  secret = {};

  unaryOps = {
    '-': function(x) {
      return Proxy.dispatchUnary('-', x, function() { return -x; });
    },
    '!': function(x) {
      return Proxy.dispatchUnary('!', x, function() { return !x; });
    }
  };

  binOps = {
    '+': function(x, y) {
      return Proxy.dispatchBinary('+', x, y, function() { return x + y;});
    },
    '-': function(x, y) {
      return Proxy.dispatchBinary('-', x, y, function() { return x - y;});
    },
    '*': function(x, y) {
      return Proxy.dispatchBinary('*', x, y, function() { return x * y;});
    },
    '/': function(x, y) {
      return Proxy.dispatchBinary('/', x, y, function() { return x / y;});
    },
    '&&': function(x, y) {
      return Proxy.dispatchBinary('&&', x, y, function() { return x && y;});
    },
    '||': function(x, y) {
      return Proxy.dispatchBinary('||', x, y, function() { return x || y;});
    },
    '===': function(x, y) {
      return Proxy.dispatchBinary('===', x, y, function() { return x === y;});
    },
    '!==': function(x, y) {
      return Proxy.dispatchBinary('!==', x, y, function() { return x !== y;});
    }
  };

  exports.values = values = function() {
    var h, vals;
    vals = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    h = {
      vals: vals,
      unary: function(o) {
        return unaryOps[o](this.vals[0]);
      },
      left: function(o, right) {
        h = Proxy.unProxy(secret, right);
        if (Proxy.dispatchTest(h)) {
          return binOps[o](this.vals[0], h.vals[0]);
        } else {
          return binOps[o](this.vals[0], right);
        }
      },
      right: function(o, left) {
        return binOps[o](left, this.vals[0]);
      },
      test: function() {
        return this.vals[0];
      }
    };
    return Proxy.create(h, null, secret);
  };

  exports.bind = bind = function(v) {
    var h;
    h = Proxy.unProxy(secret, v);
    if (Proxy.dispatchTest(h)) {
      return h.vals;
    } else {
      return [];
    }
  };

}).call(this);
}).call(this);
