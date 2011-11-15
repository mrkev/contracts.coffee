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


  var df, secret;
  var __slice = Array.prototype.slice;

  secret = {};

  df = function(f, fakeArity, partialArgs) {
    var call, h;
    if (Proxy.dispatchTest(partialArgs == null)) partialArgs = [];
    h = {
      partialArgs: partialArgs,
      f: f,
      get: function(r, name) {
        if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('===', name, 'length', function() { return name === 'length';}), (fakeArity != null), function() { return Proxy.dispatchBinary('===', name, 'length', function() { return name === 'length';}) && (fakeArity != null);}))) {
          return fakeArity;
        } else {
          return f[name];
        }
      },
      left: function(o, r) {
        if (Proxy.dispatchTest(Proxy.dispatchBinary('===', o, '+', function() { return o === '+';}))) {
          return df((function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return f(r.apply(this, args));
          }), r.length);
        }
      }
    };
    call = function() {
      var args, flen;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      flen = Proxy.dispatchTest(fakeArity != null) ? fakeArity : f.length;
      if (Proxy.dispatchTest(Proxy.dispatchBinary('<', (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), flen, function() { return (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})) < flen;}))) {
        return df(f, null, h.partialArgs.concat(args));
      } else if (Proxy.dispatchTest(Proxy.dispatchBinary('>', (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), flen, function() { return (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})) > flen;}))) {
        throw Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}), " but was expecting ", function() { return Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}) + " but was expecting ";}), f.length, function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}), " but was expecting ", function() { return Proxy.dispatchBinary('+', "Too many arguments: supplied ", (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;})), function() { return "Too many arguments: supplied " + (Proxy.dispatchBinary('+', args.length, h.partialArgs.length, function() { return args.length + h.partialArgs.length;}));}) + " but was expecting ";}) + f.length;});
      } else {
        return f.apply(this, h.partialArgs.concat(args));
      }
    };
    return Proxy.createFunction(h, call, call);
  };

  exports.deffun = function(f) {
    return df(f, null);
  };

}).call(this);
