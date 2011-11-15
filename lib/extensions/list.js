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


  var List, arrayEgal, binOps, egal, head, makeList, print, secret, split, tail;

  secret = {};

  print = console.log;

  egal = function(a, b) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('===', a, b, function() { return a === b;}))) {
      return Proxy.dispatchBinary('||', Proxy.dispatchBinary('!==', a, 0, function() { return a !== 0;}), Proxy.dispatchBinary('===', Proxy.dispatchBinary('/', 1, a, function() { return 1 / a;}), Proxy.dispatchBinary('/', 1, b, function() { return 1 / b;}), function() { return Proxy.dispatchBinary('/', 1, a, function() { return 1 / a;}) === Proxy.dispatchBinary('/', 1, b, function() { return 1 / b;});}), function() { return Proxy.dispatchBinary('!==', a, 0, function() { return a !== 0;}) || Proxy.dispatchBinary('===', Proxy.dispatchBinary('/', 1, a, function() { return 1 / a;}), Proxy.dispatchBinary('/', 1, b, function() { return 1 / b;}), function() { return Proxy.dispatchBinary('/', 1, a, function() { return 1 / a;}) === Proxy.dispatchBinary('/', 1, b, function() { return 1 / b;});});});
    } else {
      return Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', a, a, function() { return a !== a;}), Proxy.dispatchBinary('!==', b, b, function() { return b !== b;}), function() { return Proxy.dispatchBinary('!==', a, a, function() { return a !== a;}) && Proxy.dispatchBinary('!==', b, b, function() { return b !== b;});});
    }
  };

  arrayEgal = function(a, b) {
    var el, idx, _len;
    if (Proxy.dispatchTest(egal(a, b))) {
      return true;
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('instanceof', a, Array, function() { return a instanceof Array;}), Proxy.dispatchBinary('instanceof', b, Array, function() { return b instanceof Array;}), function() { return Proxy.dispatchBinary('instanceof', a, Array, function() { return a instanceof Array;}) && Proxy.dispatchBinary('instanceof', b, Array, function() { return b instanceof Array;});}))) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', a.length, b.length, function() { return a.length !== b.length;}))) {
        return false;
      }
      for (idx = 0, _len = a.length; idx < _len; idx++) {
        el = a[idx];
        if (Proxy.dispatchTest(Proxy.dispatchUnary('!', arrayEgal(el, b[idx]), function() { return !arrayEgal(el, b[idx]); }))) {
          return false;
        }
      }
      return true;
    }
  };

  List = (function(a) {
    if (Proxy.dispatchTest(Proxy.unProxy(secret, a))) {
      return true;
    } else {
      return false;
    }
  }).toContract();

  binOps = {
    '+': function(a, b) {
      return makeList(a.concat(b));
    },
    '===': function(a, b) {
      return arrayEgal(a, b);
    }
  };

  makeList = function(a) {
    return Proxy.create({
      array: a,
      get: function(r, name) {
        return this.array[name];
      },
      set: function(r, name, val) {
        throw Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}), "' to '", function() { return Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}) + "' to '";}), val, function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}), "' to '", function() { return Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}) + "' to '";}) + val;}), "', List is immutable!", function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}), "' to '", function() { return Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}) + "' to '";}), val, function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}), "' to '", function() { return Proxy.dispatchBinary('+', "Cannot set '", name, function() { return "Cannot set '" + name;}) + "' to '";}) + val;}) + "', List is immutable!";});
      },
      left: function(o, right) {
        var h;
        h = Proxy.unProxy(secret, right);
        if (Proxy.dispatchTest(h)) {
          return binOps[o](this.array, h.array);
        } else {
          return binOps[o](this.array, right);
        }
      },
      right: function(o, left) {
        return binOps[o](left, this.array);
      }
    }, null, secret);
  };

  exports.list = makeList;

  exports.head = guard(fun([List], Any, {}),head = function(l) {
    var h;
    h = Proxy.unProxy(secret, l);
    if (Proxy.dispatchTest(h)) {
      return h.array[0];
    } else {
      throw "Not a list";
    }
  });

  exports.tail = guard(fun([List], List, {}),tail = function(l) {
    var h;
    h = Proxy.unProxy(secret, l);
    if (Proxy.dispatchTest(h)) {
      return makeList(h.array.slice(1, h.array.length));
    } else {
      throw "Not a List";
    }
  });

  exports.split = guard(fun([List], arr([Any, List]), {}),split = function(l) {
    return [head(l), tail(l)];
  });

}).call(this);
