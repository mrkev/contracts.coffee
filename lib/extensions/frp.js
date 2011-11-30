(function() {(function() {
  var old_require;
  if (typeof require !== 'undefined' && require !== null) {
    old_require = require;
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
  }
})();

  var FlapjaxBehavior, Reactive, Unit, fj, makeIdHandler, merge, numBinaryOps, numUnaryOps, reactive, secret, _ref;

  _ref = require('./utils', 'extensions/frp.coffee'), makeIdHandler = _ref.makeIdHandler, merge = _ref.merge, numUnaryOps = _ref.numUnaryOps, numBinaryOps = _ref.numBinaryOps;

  fj = require("./flapjax", 'extensions/frp.coffee');

  secret = {};

  Unit = (function(x) {
    return Proxy.dispatchBinary('===', x, void 0, function() { return x === void 0;});
  }).toContract();

  FlapjaxBehavior = (function(x) {
    return Proxy.dispatchBinary('instanceof', x, fj.Behavior, function() { return x instanceof fj.Behavior;});
  }).toContract();

  Reactive = (function(x) {
    if (Proxy.dispatchTest(Proxy.unProxy(secret, x))) {
      return true;
    } else {
      return false;
    }
  }).toContract();

  reactive = guard(fun([or(Num, FlapjaxBehavior)], Reactive, {}),function(x) {
    var b, handler, p;
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', x, fj.Behavior, function() { return x instanceof fj.Behavior;}))) {
      b = x;
    } else {
      b = fj.startsWith(fj.receiverE(), x);
    }
    handler = merge(makeIdHandler(), {
      beh: b
    });
    handler.left = function(o, r) {
      var h;
      h = Proxy.unProxy(secret, r);
      if (Proxy.dispatchTest(h)) {
        return reactive(fj.liftB(numBinaryOps[o], this.beh, h.beh));
      } else {
        return reactive(fj.liftB(numBinaryOps[o], this.beh, r));
      }
    };
    p = Proxy.create(handler, null, secret);
    p.set = function(n) {
      var h;
      h = Proxy.unProxy(secret, this);
      return h.beh.sendBehavior(n);
    };
    p.curr = function() {
      var h;
      h = Proxy.unProxy(secret, this);
      return h.beh.valueNow();
    };
    return p;
  });

  reactive = reactive.use("self");

  exports.reactive = guard(fun([Num], Reactive, {}),reactive);

}).call(this);
