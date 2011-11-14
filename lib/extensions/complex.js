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

  makeComplex = { use: function() { return function(r, i) {
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
  }; } };

  exports.makeComplex = makeComplex;

  makeComplex = makeComplex.use("self");

  exports.isComplex = { use: function() { return isComplex = function(x) {
    if (Proxy.dispatchTest(Proxy.unProxy(secret, x))) {
      return true;
    } else {
      return false;
    }
  }; } };

  exports.i = makeComplex(0, 1);

}).call(this);
