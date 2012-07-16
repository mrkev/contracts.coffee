
((function(cb) {
  if (typeof(define) === 'function' && define.amd) {
    require(['contracts'], cb);
  } else if (typeof(require) === 'function') {
    cb(require('contracts.js'));
  } else {
    cb(window.contracts);
  }
})(function(__contracts) {
  var Undefined, Null, Num, Bool, Str, Odd, Even, Pos, Nat, Neg, Self, Any, None, __define, __require, __exports;

Undefined =  __contracts.Undefined;
Null      =  __contracts.Null;
Num       =  __contracts.Num;
Bool      =  __contracts.Bool;
Str       =  __contracts.Str;
Odd       =  __contracts.Odd;
Even      =  __contracts.Even;
Pos       =  __contracts.Pos;
Nat       =  __contracts.Nat;
Neg       =  __contracts.Neg;
Self      =  __contracts.Self;
Any       =  __contracts.Any;
None      =  __contracts.None;

if (typeof(define) === 'function' && define.amd) {
  // we're using requirejs

  // Allow for anonymous functions
  __define = function(name, deps, callback) {
    var cb, wrapped_callback;

    if(typeof(name) !== 'string') {
      cb = deps;
    } else {
      cb = callback;
    }


    wrapped_callback = function() {
      var i, ret, used_arguments = [];
      for (i = 0; i < arguments.length; i++) {
        used_arguments[i] = __contracts.use(arguments[i], "test/webtest/scripts/modules/adder_module.coffee");
      }
      ret = cb.apply(this, used_arguments);
      return __contracts.setExported(ret, "test/webtest/scripts/modules/adder_module.coffee");
    };

    if(!Array.isArray(deps)) {
      deps = wrapped_callback;
    }
    define(name, deps, wrapped_callback);
  };
} else if (typeof(require) !== 'undefined' && typeof(exports) !== 'undefined') {
  // we're using commonjs

  __exports = __contracts.exports("test/webtest/scripts/modules/adder_module.coffee", exports)
  __require = function(module) {
    module = require.apply(this, arguments);
    return __contracts.use(module, "test/webtest/scripts/modules/adder_module.coffee");
  };
}
  (function(define, require, exports) {
    
  define([], function() {
    var add;
    add = __contracts.guard(__contracts.fun([Num], Pos, {}),function(x) {
      return x + 10;
    });
    return {
      add: add
    };
  });

  }).call(this, __define, __require, __exports);
}));