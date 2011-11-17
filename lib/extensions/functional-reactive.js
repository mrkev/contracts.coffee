(function() {(function() {
  var old_require = require;
  require = function(mod, filename) {
    var key, m = old_require(mod);
    for(key in m) {
      if(typeof(m[key]) && m[key].hasOwnProperty && m[key].hasOwnProperty('use')) {
        m[key] = m[key].use(filename, mod);
      }
    }
    return m;
  };
  for(var key in old_require) {
    require[key] = old_require[key];
  }
})();

  var Reactive, STOP, StopVal, binaryOps, id, makeIdHandler, makeReactive, secret, unaryOps;

  makeIdHandler = require('./utils', 'extensions/functional-reactive.coffee').makeIdHandler;

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

  makeReactive = guard(fun([or(Null, arr([___(Reactive)])), fun([Any], or(Any, StopVal), {}), opt(Any)], Reactive, {}),function(source, update, value) {
    var handler, p;
    if (Proxy.dispatchTest(value == null)) value = null;
    handler = makeIdHandler();
    handler.sinks = [];
    handler.value = value;
    handler.update = update;
    handler.sources = Proxy.dispatchTest(source != null) ? source : [];
    p = Proxy.create(handler, null, secret);
    handler.left = function(o, r) {
      var h, src, upd, val;
      h = Proxy.unProxy(secret, r);
      if (Proxy.dispatchTest(h)) {
        throw "not implemented";
      } else {
        val = binaryOps[o](this.value, r);
        upd = function(t) {
          return binaryOps[o](t, r);
        };
        src = p;
        return makeReactive([src], upd, val);
      }
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
      var s, upd, _i, _len, _ref, _results;
      upd = handler.update(x);
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', upd, STOP, function() { return upd !== STOP;}))) {
        handler.value = upd;
        _ref = handler.sinks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s.set(upd));
        }
        return _results;
      }
    };
    return p;
  });

  makeReactive = makeReactive.use("self");

  exports.reactive = guard(fun([Any], Reactive, {}),function(x) {
    return makeReactive(null, id, x);
  });

}).call(this);
