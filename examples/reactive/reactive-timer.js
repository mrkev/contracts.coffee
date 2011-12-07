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

  var $E, dom, insertValue, reactive, reactiveTimer;

  loadVirt.patch();

  reactive = frp.reactive, reactiveTimer = frp.reactiveTimer, $E = frp.$E, insertValue = frp.insertValue, dom = frp.dom;

  $(document).ready(function() {
    var clickTms, elapsed, now, startTm;
    now = reactiveTimer(1000);
    startTm = now.curr();
    clickTms = $E("reset", "click").snapshot(now).startsWith(startTm);
    elapsed = Proxy.dispatchBinary('-', now, clickTms, function() { return now - clickTms;});
    return dom("#curTime").text(elapsed);
  });

}).call(this);
