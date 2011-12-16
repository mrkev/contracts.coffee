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
exports = __contracts.makeContractsExports("extensions/info-reactive.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/info-reactive.coffee");
};
(function() {
  var HIGH, LOW, Label, Reactive, STOP, StopVal, binaryOps, getValue, id, join, makeIdHandler, makeReactive, merge, secret, unaryOps, _ref;

  _ref = require('./utils'), makeIdHandler = _ref.makeIdHandler, merge = _ref.merge;

  secret = {};

  STOP = {};

  exports.HIGH = HIGH = 1;

  exports.LOW = LOW = 0;

  Label = (function(x) {
    return Proxy.dispatchBinary('||', Proxy.dispatchBinary('===', x, HIGH, function() { return x === HIGH;}), Proxy.dispatchBinary('===', x, LOW, function() { return x === LOW;}), function() { return Proxy.dispatchBinary('===', x, HIGH, function() { return x === HIGH;}) || Proxy.dispatchBinary('===', x, LOW, function() { return x === LOW;});});
  }).toContract();

  join = __contracts.guard(__contracts.fun([Label, Label], Label, {}),function(a, b) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('||', Proxy.dispatchBinary('===', a, HIGH, function() { return a === HIGH;}), Proxy.dispatchBinary('===', b, HIGH, function() { return b === HIGH;}), function() { return Proxy.dispatchBinary('===', a, HIGH, function() { return a === HIGH;}) || Proxy.dispatchBinary('===', b, HIGH, function() { return b === HIGH;});}))) {
      return HIGH;
    } else {
      return LOW;
    }
  });

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

  getValue = __contracts.guard(__contracts.fun([__contracts.arr([Num, Num]), Label], Num, {}),function(v, label) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('===', v[label], void 0, function() { return v[label] === void 0;}))) {
      return v[LOW];
    } else {
      return v[label];
    }
  });

  makeReactive = __contracts.guard(__contracts.fun([__contracts.or(Null, __contracts.arr([__contracts.___(Reactive)])), __contracts.fun([Any], __contracts.or(Any, StopVal), {}), __contracts.opt(Any), __contracts.opt(Label)], Reactive, {}),function(source, update, value, label) {
    var handler, p;
    if (Proxy.dispatchTest(value == null)) value = null;
    if (Proxy.dispatchTest(label == null)) label = LOW;
    handler = merge(makeIdHandler(), {
      sinks: [],
      value: [void 0, void 0],
      update: update,
      label: label
    });
    handler.value[label] = value;
    handler.sources = Proxy.dispatchTest(source != null) ? source : [];
    p = Proxy.create(handler, null, secret);
    handler.left = function(o, r) {
      var h, src, upd, val;
      src = p;
      h = Proxy.unProxy(secret, r);
      if (Proxy.dispatchTest(h)) {
        upd = function(t) {
          var hand;
          hand = Proxy.unProxy(secret, t);
          if (Proxy.dispatchTest(hand)) {
            return binaryOps[o](getValue(hand.value, hand.label), getValue(h.value, h.label));
          } else {
            return binaryOps[o](t, getValue(h.value, h.label));
          }
        };
        val = binaryOps[o](getValue(this.value, this.label), getValue(h.value, h.label));
        return makeReactive([src], upd, val, join(this.label, h.label));
      } else {
        upd = function(t) {
          var hand;
          hand = Proxy.unProxy(secret, t);
          if (Proxy.dispatchTest(hand)) {
            return binaryOps[o](getValue(hand.value, hand.label), r);
          } else {
            return binaryOps[o](t, r);
          }
        };
        val = binaryOps[o](getValue(this.value, this.label), r);
        return makeReactive([src], upd, val, this.label);
      }
    };
    handler.right = function(o, l) {
      var src, upd, val;
      src = p;
      upd = function(t) {
        return binaryOps[o](l, t);
      };
      val = binaryOps[o](l, getValue(this.value, this.label));
      return makeReactive([src], upd, val, this.label);
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
      var h, l, s, upd, _i, _len, _ref2, _results;
      h = Proxy.unProxy(secret, x);
      if (Proxy.dispatchTest(h)) {
        l = join(handler.label, h.label);
      } else {
        l = handler.label;
      }
      upd = handler.update(x);
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', upd, STOP, function() { return upd !== STOP;}))) {
        handler.value[l] = upd;
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

  exports.outputLow = function(x) {
    var h;
    h = Proxy.unProxy(secret, x);
    if (Proxy.dispatchTest(h)) {
      return h.value[LOW];
    } else {
      return x;
    }
  };

  exports.outputHigh = function(x) {
    var h;
    h = Proxy.unProxy(secret, x);
    if (Proxy.dispatchTest(h)) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', h.value[HIGH], void 0, function() { return h.value[HIGH] !== void 0;}))) {
        return h.value[HIGH];
      } else {
        return h.value[LOW];
      }
    } else {
      return x;
    }
  };

  exports.infoReactive = function(number, label) {
    return makeReactive(null, id, number, label);
  };

}).call(this);
}).call(this);
