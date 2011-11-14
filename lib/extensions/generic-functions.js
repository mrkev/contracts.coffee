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


  var old_create, old_createFunction, proxyMap, valueTrap;

  if (!(Proxy.__vvalues != null)) {
    Proxy.__vvalues = true;
    old_create = Proxy.create;
    old_createFunction = Proxy.createFunction;
    proxyMap = new WeakMap();
    Proxy.create = function(handler, proto, secret) {
      var p;
      p = old_create.call(this, handler, proto);
      proxyMap.set(p, [handler, secret]);
      return p;
    };
    Proxy.createFunction = function(handler, callTrap, constructTrap, secret) {
      var p;
      p = old_createFunction.call(this, handler, callTrap, constructTrap);
      proxyMap.set(p, [handler, secret]);
      return p;
    };
    Proxy.unProxy = function(secret, proxy) {
      var handler, hs, s;
      if (proxy !== Object(proxy)) return false;
      hs = proxyMap.get(proxy);
      if (hs != null) handler = hs[0], s = hs[1];
      if (s && s === secret) {
        return handler;
      } else {
        return false;
      }
    };
    valueTrap = function(trap, proxy) {
      var h;
      h = proxyMap.get(proxy, [false, false])[0];
      if (h && trap in h) return h[trap].bind(h);
    };
    Proxy.dispatchUnary = function(op, val, lazyExpr) {
      if (Proxy.isProxy(val)) {
        return (valueTrap('unary', val))(op);
      } else {
        return lazyExpr();
      }
    };
    Proxy.dispatchBinary = function(op, left, right, lazyExpr) {
      if (Proxy.isProxy(left)) {
        return (valueTrap('left', left))(op, right);
      } else if (Proxy.isProxy(right)) {
        return (valueTrap('right', right))(op, left);
      } else {
        return lazyExpr();
      }
    };
    Proxy.dispatchTest = function(cond) {
      if (Proxy.isProxy(cond)) {
        return (valueTrap('test', cond))();
      } else {
        return cond;
      }
    };
    Proxy.isProxy = function(p) {
      if (p !== Object(p)) {
        return false;
      } else {
        return proxyMap.has(p);
      }
    };
  }

}).call(this);


  var defgeneric, defmethod, secret;
  var __slice = Array.prototype.slice;

  secret = {};

  exports.defgeneric = defgeneric = function() {
    var call, construct, h;
    h = {
      paramPredicates: [],
      test: function() {
        return true;
      }
    };
    call = function() {
      var args, check, predicate, res;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (Proxy.dispatchTest(Proxy.dispatchBinary('===', h.paramPredicates.length, 0, function() { return h.paramPredicates.length === 0;}))) {
        throw "no method specializations defined";
      }
      check = function(paramPredicates) {
        if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', args.length, paramPredicates.length, function() { return args.length !== paramPredicates.length;}))) {
          return false;
        } else {
          return args.every(function(arg, index) {
            return Proxy.dispatchBinary('&&', (paramPredicates[index] != null), paramPredicates[index](arg), function() { return (paramPredicates[index] != null) && paramPredicates[index](arg);});
          });
        }
      };
      res = (function() {
        var _i, _len, _ref, _results;
        _ref = h.paramPredicates;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          predicate = _ref[_i];
          if (Proxy.dispatchTest(check(predicate[0]))) _results.push(predicate[1]);
        }
        return _results;
      })();
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', (Proxy.dispatchTest(res != null) ? res.length : void 0), 1, function() { return (Proxy.dispatchTest(res != null) ? res.length : void 0) !== 1;}))) {
        throw "multiple specializations match";
      } else {
        return res[0].apply(this, args);
      }
    };
    construct = function() {
      throw "not defined";
    };
    return Proxy.createFunction(h, call, construct, secret);
  };

  exports.defmethod = defmethod = function() {
    var body, f, h, preds, rest;
    f = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    h = Proxy.unProxy(secret, f);
    if (Proxy.dispatchTest(h)) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('===', rest.length, 0, function() { return rest.length === 0;}))) {
        throw "must define a body";
      } else {
        preds = rest.slice(0, (Proxy.dispatchBinary('-', rest.length, 1, function() { return rest.length - 1;})));
        body = rest[Proxy.dispatchBinary('-', rest.length, 1, function() { return rest.length - 1;})];
        return h.paramPredicates.push([preds, body]);
      }
    } else {
      throw "not a generic function";
    }
  };

}).call(this);
