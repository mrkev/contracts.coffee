(function() {
(function() {

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

  var binOps, bind, secret, unaryOps, values;
  var __slice = Array.prototype.slice;

  secret = {};

  unaryOps = {
    '-': function(x) {
      return Proxy.dispatchUnary('-', x, function() { return -x; });
    },
    '!': function(x) {
      return Proxy.dispatchUnary('!', x, function() { return !x; });
    }
  };

  binOps = {
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
    '&&': function(x, y) {
      return Proxy.dispatchBinary('&&', x, y, function() { return x && y;});
    },
    '||': function(x, y) {
      return Proxy.dispatchBinary('||', x, y, function() { return x || y;});
    },
    '===': function(x, y) {
      return Proxy.dispatchBinary('===', x, y, function() { return x === y;});
    },
    '!==': function(x, y) {
      return Proxy.dispatchBinary('!==', x, y, function() { return x !== y;});
    }
  };

  exports.values = values = function() {
    var h, vals;
    vals = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    h = {
      vals: vals,
      unary: function(o) {
        return unaryOps[o](this.vals[0]);
      },
      left: function(o, right) {
        h = Proxy.unProxy(secret, right);
        if (Proxy.dispatchTest(h)) {
          return binOps[o](this.vals[0], h.vals[0]);
        } else {
          return binOps[o](this.vals[0], right);
        }
      },
      right: function(o, left) {
        return binOps[o](left, this.vals[0]);
      },
      test: function() {
        return this.vals[0];
      }
    };
    return Proxy.create(h, null, secret);
  };

  exports.bind = bind = function(v) {
    var h;
    h = Proxy.unProxy(secret, v);
    if (Proxy.dispatchTest(h)) {
      return h.vals;
    } else {
      return [];
    }
  };

}).call(this);
