(function() {var __contracts, Undefined, Null, Num, Bool, Str, Odd, Even, Pos, Nat, Neg, Self, Any, None, __old_exports, __old_require;
if (typeof(window) !== 'undefined' && window !== null) {
  __contracts = window.Contracts;
} else {
  __contracts = require('contracts.js');
}
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

__old_exports = exports;
exports = __contracts.makeContractsExports("extensions/units.coffee", __old_exports)
__old_require = require;
require = function() {
  var module;
  module = __old_require.apply(this, arguments);
  return __contracts.use(module, "extensions/units.coffee");
};
(function() {
  var Quantity, dropUnit, leftOps, makeQuantity, makeUnit, rightOps, secret, unaryOps;

  secret = {};

  Quantity = (function(x) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('||', Proxy.dispatchBinary('===', Proxy.dispatchUnary('typeof', x, function() { return typeof x; }), 'number', function() { return Proxy.dispatchUnary('typeof', x, function() { return typeof x; }) === 'number';}), Proxy.unProxy(secret, x), function() { return Proxy.dispatchBinary('===', Proxy.dispatchUnary('typeof', x, function() { return typeof x; }), 'number', function() { return Proxy.dispatchUnary('typeof', x, function() { return typeof x; }) === 'number';}) || Proxy.unProxy(secret, x);}))) {
      return true;
    } else {
      return false;
    }
  }).toContract();

  makeQuantity = __contracts.guard(__contracts.fun([Str, Num, Quantity], Quantity, {}),function(u, i, n) {
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

  dropUnit = __contracts.guard(__contracts.fun([Str, Num, Quantity], Quantity, {}),function(u, i, n) {
    var h;
    h = Proxy.unProxy(secret, n);
    if (Proxy.dispatchTest(Proxy.dispatchUnary('!', (Proxy.dispatchBinary('&&', Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}), Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;}), function() { return Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}) && Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;});})), function() { return !(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}), Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;}), function() { return Proxy.dispatchBinary('&&', Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}), Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;}), function() { return Proxy.dispatchBinary('!==', h, false, function() { return h !== false;}) && Proxy.dispatchBinary('===', h.unit, u, function() { return h.unit === u;});}) && Proxy.dispatchBinary('===', h.index, i, function() { return h.index === i;});})); }))) {
      throw "bad units!";
    }
    return h.value;
  });

  exports.makeUnit = __contracts.guard(__contracts.fun([Str], Quantity, {}),makeUnit = function(u) {
    return makeQuantity(u, 1, 1);
  });

}).call(this);
}).call(this);
