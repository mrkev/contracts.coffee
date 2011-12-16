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
exports = __contracts.makeContractsExports("extensions/functional-reactive.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/functional-reactive.coffee");
};
(function() {
  var Reactive, STOP, StopVal, binaryOps, id, makeIdHandler, makeReactive, merge, reactiveAlt, secret, unaryOps, _ref;

  _ref = require('./utils'), makeIdHandler = _ref.makeIdHandler, merge = _ref.merge;

  secret = {};

  STOP = {};

  id = function(x) {
    return x;
  };

  unaryOps = {
    '!': function(x) {
      return Proxy.dispatchUnary('!', x, function() { return !x; });
    },
    '-': function(x) {
      return Proxy.dispatchUnary('-', x, function() { return -x; });
    }
  };

  binaryOps = {
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

  Reactive = (function(x) {
    if (Proxy.dispatchTest(Proxy.unProxy(secret, x))) {
      return true;
    } else {
      return false;
    }
  }).toContract();

  StopVal = (function(x) {
    return Proxy.dispatchBinary('===', x, STOP, function() { return x === STOP;});
  }).toContract();

  makeReactive = __contracts.guard(__contracts.fun([__contracts.or(Null, __contracts.arr([__contracts.___(Reactive)])), __contracts.fun([Any], __contracts.or(Any, StopVal), {}), __contracts.opt(Any)], Reactive, {}),function(source, update, value) {
    var handler, p;
    if (Proxy.dispatchTest(value == null)) value = null;
    handler = merge(makeIdHandler(), {
      sinks: [],
      value: value,
      update: update
    });
    handler.sources = Proxy.dispatchTest(source != null) ? source : [];
    p = Proxy.create(handler, null, secret);
    handler.left = function(o, r) {
      var h, src, upd, val;
      src = p;
      upd = function(t) {
        return binaryOps[o](t, r);
      };
      h = Proxy.unProxy(secret, r);
      if (Proxy.dispatchTest(h)) {
        val = binaryOps[o](this.value, h.value);
        return makeReactive([src], upd, val);
      } else {
        val = binaryOps[o](this.value, r);
        return makeReactive([src], upd, val);
      }
    };
    handler.right = function(o, l) {
      var src, upd, val;
      src = p;
      upd = function(t) {
        return binaryOps[o](l, t);
      };
      val = binaryOps[o](l, this.value);
      return makeReactive([src], upd, val);
    };
    handler.test = function(c) {
      return true;
    };
    handler.sources.forEach(function(s) {
      var h;
      h = Proxy.unProxy(secret, s);
      if (Proxy.dispatchTest(h)) {
        return h.sinks.push(p);
      } else {
        throw "Source is not a reactive value!";
      }
    });
    p.set = function(x) {
      var s, upd, _i, _len, _ref2, _results;
      upd = handler.update(x);
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', upd, STOP, function() { return upd !== STOP;}))) {
        handler.value = upd;
        _ref2 = handler.sinks;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          s = _ref2[_i];
          _results.push(s.set(upd));
        }
        return _results;
      }
    };
    return p;
  });

  reactiveAlt = function() {
    var handler, listen, listeners, p, reactiveFrom, set, value;
    value = null;
    listeners = [];
    listen = function(f) {
      listeners.push(f);
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', value, null, function() { return value !== null;}))) {
        return f(value);
      }
    };
    set = function(x) {
      value = x;
      return listeners.forEach(function(f) {
        return f(x);
      });
    };
    reactiveFrom = function(f) {
      var r, sett, _ref2;
      _ref2 = reactiveAlt(), r = _ref2[0], sett = _ref2[1];
      listen(function(v) {
        return sett(f(v));
      });
      return r;
    };
    handler = {
      listen: listen,
      current: function() {
        return value;
      },
      left: function(o, r) {
        var h, rr, sett, _ref2;
        h = Proxy.unProxy(secret, r);
        if (Proxy.dispatchTest(h)) {
          _ref2 = reactiveAlt(), rr = _ref2[0], sett = _ref2[1];
          listen(function(v) {
            return sett(binaryOps[o](v, h.current()));
          });
          handler.listen(function(v) {
            return sett(binaryOps[o](value, v));
          });
          return rr;
        } else {
          return reactiveFrom(function(v) {
            return binaryOps[o](v, r);
          });
        }
      },
      right: function(o, l) {
        return reactiveFrom(function(v) {
          return binaryOps[o](l, v);
        });
      }
    };
    p = Proxy.create(handler, null, secret);
    return [p, set];
  };

  exports.reactive = __contracts.guard(__contracts.fun([Any], Reactive, {}),function(x) {
    return makeReactive(null, id, x);
  });

  exports.reactiveAlt = reactiveAlt;

  exports.getCurrent = __contracts.guard(__contracts.fun([Reactive], Any, {}),function(r) {
    var h;
    h = Proxy.unProxy(secret, r);
    return h.current();
  });

  exports.addListener = __contracts.guard(__contracts.fun([Reactive], Any, {}),function(r, f) {
    var h;
    h = Proxy.unProxy(secret, r);
    return h.listen(f);
  });

}).call(this);
}).call(this);
