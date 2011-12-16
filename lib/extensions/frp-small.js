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
exports = __contracts.makeContractsExports("extensions/frp-small.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/frp-small.coffee");
};
(function() {
  var makeIdHandler, merge, numBinaryOps, numUnaryOps, reactive, reactiveSecret, root, stream, streamSecret, unwrap, wrap;
  var __slice = Array.prototype.slice;

  makeIdHandler = utils.makeIdHandler, merge = utils.merge, numUnaryOps = utils.numUnaryOps, numBinaryOps = utils.numBinaryOps;

  reactiveSecret = {};

  streamSecret = {};

  root = Proxy.dispatchTest(typeof global !== "undefined" && global !== null) ? global : this;

  wrap = function(x) {
    var _this = this;
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', x, Behavior, function() { return x instanceof Behavior;}))) {
      return reactive(x);
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', x, EventStream, function() { return x instanceof EventStream;}))) {
      return stream(x);
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('===', Proxy.dispatchUnary('typeof', x, function() { return typeof x; }), 'function', function() { return Proxy.dispatchUnary('typeof', x, function() { return typeof x; }) === 'function';}))) {
      return function() {
        var arg, args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return wrap(x.apply(_this, (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = args.length; _i < _len; _i++) {
            arg = args[_i];
            _results.push(unwrap(arg));
          }
          return _results;
        })()));
      };
    } else {
      return x;
    }
  };

  unwrap = function(x) {
    var rh, sh;
    rh = Proxy.unProxy(reactiveSecret, x);
    sh = Proxy.unProxy(streamSecret, x);
    if (Proxy.dispatchTest(rh)) {
      return rh.beh;
    } else if (Proxy.dispatchTest(sh)) {
      return sh.evt;
    } else {
      return x;
    }
  };

  root.reactive = reactive = function(x) {
    var b, handler;
    b = Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', x, Behavior, function() { return x instanceof Behavior;})) ? x : startsWith(receiverE(), x);
    handler = merge(makeIdHandler(b), {
      beh: b,
      get: function(r, name) {
        return (wrap.bind(handler.beh))(handler.beh[name]);
      },
      unary: function(o) {
        return reactive(liftB(numUnaryOps[o], this.beh));
      },
      left: function(o, r) {
        var h;
        h = Proxy.unProxy(reactiveSecret, r);
        if (Proxy.dispatchTest(h)) {
          return reactive(liftB(numBinaryOps[o], this.beh, h.beh));
        } else {
          return reactive(liftB(numBinaryOps[o], this.beh, r));
        }
      },
      right: function(o, l) {
        return reactive(liftB(numBinaryOps[o], l, this.beh));
      },
      test: function(c) {
        throw "Conditional on a reactive is not supported!";
      }
    });
    return Proxy.create(handler, null, reactiveSecret);
  };

  stream = function(e) {
    var handler;
    if (Proxy.dispatchTest(Proxy.dispatchUnary('!', (Proxy.dispatchBinary('instanceof', e, EventStream, function() { return e instanceof EventStream;})), function() { return !(Proxy.dispatchBinary('instanceof', e, EventStream, function() { return e instanceof EventStream;})); }))) {
      throw "streams must be built from EventStreams";
    }
    handler = merge(makeIdHandler(e), {
      evt: e,
      get: function(r, name) {
        return (wrap.bind(handler.evt))(handler.evt[name]);
      }
    });
    return Proxy.create(handler, null, streamSecret);
  };

  root.timerB = wrap(timerB);

  root.insertValueB = wrap(insertValueB);

  root.$E = wrap($E);

  root.$B = wrap($B);

}).call(this);
}).call(this);
