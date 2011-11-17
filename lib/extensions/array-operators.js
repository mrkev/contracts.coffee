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


  var OpArray, binOps, makeArray, secret;

  secret = {};

  binOps = guard(object({
    '+': fun([arr([___(Any)]), arr([___(Any)])], arr([___(Any)]), {}),
    '===': fun([arr([___(Any)]), arr([___(Any)])], Bool, {})
  }, {}),{
    '+': function(a, b) {
      return a.concat(b);
    },
    '===': function(a, b) {
      return Proxy.dispatchBinary('===', a, b, function() { return a === b;});
    }
  });

  binOps = binOps.use("self");

  makeArray = function(a) {
    return Proxy.create({
      array: a,
      left: function(o, right) {
        var h;
        h = Proxy.unProxy(secret, right);
        if (Proxy.dispatchTest(h)) {
          return makeArray(binOps[o](this.array, h.array));
        } else {
          return makeArray(binOps[o](this.array, right));
        }
      },
      right: function(o, left) {
        return makeArray(binOps[o](left, this.array));
      }
    }, null, secret);
  };

  OpArray = (function(a) {
    if (Proxy.dispatchTest(Proxy.unProxy(secret, a))) {
      return true;
    } else {
      return false;
    }
  }).toContract();

  exports.makeArray = guard(fun([arr([___(Any)])], OpArray, {}),makeArray);

}).call(this);
