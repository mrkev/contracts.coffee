(function() {

  var old, proxyMap, valueTrap;

  if (!(Proxy.__vvalues != null)) {
    Proxy.__vvalues = true;
    old = Proxy.create;
    proxyMap = new WeakMap();
    Proxy.create = function(handler, proto, secret) {
      var p;
      p = old.call(this, handler, proto);
      proxyMap.set(p, [handler, secret]);
      return p;
    };
    Proxy.unProxy = function(secret, proxy) {
      var handler, s, _ref;
      if (proxy !== Object(proxy)) return false;
      _ref = proxyMap.get(proxy, [false, false]), handler = _ref[0], s = _ref[1];
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
