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


  var Quantity, dropUnit, leftOps, makeQuantity, makeUnit, rightOps, secret, unaryOps;

  secret = {};

  Quantity = (function(x) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('||', Proxy.dispatchBinary('===', Proxy.dispatchUnary('typeof', x, function() { return typeof x; }), 'number', function() { return Proxy.dispatchUnary('typeof', x, function() { return typeof x; }) === 'number';}), Proxy.unProxy(secret, x), function() { return Proxy.dispatchBinary('===', Proxy.dispatchUnary('typeof', x, function() { return typeof x; }), 'number', function() { return Proxy.dispatchUnary('typeof', x, function() { return typeof x; }) === 'number';}) || Proxy.unProxy(secret, x);}))) {
      return true;
    } else {
      return false;
    }
  }).toContract();

  makeQuantity = guard(fun([Str, Num, Quantity], Quantity, {}),function(u, i, n) {
    var h;
    h = Proxy.unProxy(secret, n);
    if (Proxy.dispatchTest(Proxy.dispatchBinary('===', i, 0, function() { return i === 0;}))) {
      return n;
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', h, Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return h && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}))) {
      return makeQuantity(u, Proxy.dispatchBinary('+', h.index, i, function() { return h.index + i;}), h.value);
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', h, Proxy.dispatchBinary('>', h.unit, u, function() { return h.unit > u;}), function() { return h && Proxy.dispatchBinary('>', h.unit, u, function() { return h.unit > u;});}))) {
      return makeQuantity(h.unit, h.index, makeQuantity(u, i, h.value));
    } else {
      return Proxy.create({
        unit: u,
        index: i,
        value: n,
        unary: function(o) {
          return unaryOps[o](u, i, n);
        },
        left: function(o, r) {
          return leftOps[o](u, i, n, r);
        },
        right: function(o, l) {
          return rightOps[o](u, i, n, l);
        },
        test: function() {
          return n;
        }
      }, null, secret);
    }
  });

  makeQuantity = makeQuantity.use("self");

  unaryOps = {
    '-': function(u, i, n) {
      return makeQuantity(u, i, Proxy.dispatchUnary('-', n, function() { return -n; }));
    },
    'typeof': function(u, i, n) {
      return Proxy.dispatchUnary('typeof', n, function() { return typeof n; });
    }
  };

  leftOps = {
    '+': function(u, i, n, r) {
      return makeQuantity(u, i, Proxy.dispatchBinary('+', n, (dropUnit(u, i, r)), function() { return n + (dropUnit(u, i, r));}));
    },
    '*': function(u, i, n, r) {
      return makeQuantity(u, i, Proxy.dispatchBinary('*', n, r, function() { return n * r;}));
    },
    '/': function(u, i, n, r) {
      return makeQuantity(u, i, Proxy.dispatchBinary('/', n, r, function() { return n / r;}));
    },
    '===': function(u, i, n, r) {
      return Proxy.dispatchBinary('===', n, (dropUnit(u, i, r)), function() { return n === (dropUnit(u, i, r));});
    }
  };

  rightOps = {
    '+': function(u, i, n, l) {
      throw "Unit mismatch";
    },
    '*': function(u, i, n, l) {
      return makeQuantity(u, i, Proxy.dispatchBinary('*', l, n, function() { return l * n;}));
    },
    '/': function(u, i, n, l) {
      return makeQuantity(u, Proxy.dispatchUnary('-', i, function() { return -i; }), Proxy.dispatchBinary('/', l, n, function() { return l / n;}));
    },
    '=': function(u, i, n, l) {
      return false;
    }
  };

  dropUnit = guard(fun([Str, Num, Quantity], Quantity, {}),function(u, i, n) {
    var h;
    h = Proxy.unProxy(secret, n);
    if (Proxy.dispatchTest(Proxy.dispatchUnary('!', (Proxy.dispatchBinary('&&', Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}), Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;}), function() { return Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}) && Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;});})), function() { return !(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}), Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;}), function() { return Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}) && Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;});})); }))) {
      throw "bad units!";
    }
    return h.value;
  });

  dropUnit = dropUnit.use("self");

  exports.makeUnit = guard(fun([Str], Quantity, {}),makeUnit = function(u) {
    return makeQuantity(u, 1, 1);
  });

}).call(this);
