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
exports = __contracts.makeContractsExports("extensions/utils.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/utils.coffee");
};
(function() {
  var getPropertyDescriptor, root;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  root = Proxy.dispatchTest(typeof exports !== "undefined" && exports !== null) ? exports : this["utils"] = {};

  root.merge = function(a, b) {
    var key, val;
    for (key in b) {
      if (!__hasProp.call(b, key)) continue;
      val = b[key];
      a[key] = val;
    }
    return a;
  };

  root.numUnaryOps = {
    '!': function(x) {
      return Proxy.dispatchUnary('!', x, function() { return !x; });
    },
    '-': function(x) {
      return Proxy.dispatchUnary('-', x, function() { return -x; });
    }
  };

  root.numBinaryOps = {
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
    '===': function(x, y) {
      return Proxy.dispatchBinary('===', x, y, function() { return x === y;});
    },
    '!==': function(x, y) {
      return Proxy.dispatchBinary('!==', x, y, function() { return x !== y;});
    }
  };

  getPropertyDescriptor = function(obj, prop) {
    var desc, o;
    o = obj;
    while (Proxy.dispatchBinary('!==', o, null, function() { return o !== null;})) {
      desc = Object.getOwnPropertyDescriptor(o, prop);
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', desc, void 0, function() { return desc !== void 0;}))) {
        return desc;
      }
      o = Object.getPrototypeOf(o);
    }
    return;
  };

  root.makeIdHandler = function(obj) {
    if (Proxy.dispatchTest(obj == null)) obj = {};
    return {
      getOwnPropertyDescriptor: function(name) {
        var desc;
        desc = Object.getOwnPropertyDescriptor(obj, name);
        if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', desc, void 0, function() { return desc !== void 0;}))) {
          desc.configurable = true;
        }
        return desc;
      },
      getPropertyDescriptor: function(name) {
        var desc;
        desc = getPropertyDescriptor(obj, name);
        if (Proxy.dispatchTest(desc)) desc.configurable = true;
        return desc;
      },
      getOwnPropertyNames: function() {
        return Object.getOwnPropertyNames(obj);
      },
      getPropertyNames: function() {
        return Object.getPropertyNames(obj);
      },
      defineProperty: function(name, desc) {
        return Object.defineProperty(obj, name, desc);
      },
      "delete": function(name) {
        return Proxy.dispatchUnary('delete', obj[name], function() { return delete obj[name]; });
      },
      fix: function() {
        if (Proxy.dispatchTest(Object.isFrozen(obj))) {
          return Object.getOwnPropertyNames(obj).map(function(name) {
            return Object.getOwnPropertyDescriptor(obj, name);
          });
        } else {
          return;
        }
      },
      has: function(name) {
        return __indexOf.call(obj, name) >= 0;
      },
      hasOwn: function(name) {
        return Object.prototype.hasOwnProperty.call(obj, name);
      },
      enumerate: function() {
        var name, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          name = obj[_i];
          _results.push(name);
        }
        return _results;
      },
      get: function(receiver, name) {
        return obj[name];
      },
      set: function(receiver, name, val) {
        obj[name] = val;
        return true;
      },
      keys: function() {
        return Object.keys(obj);
      }
    };
  };

}).call(this);
}).call(this);
