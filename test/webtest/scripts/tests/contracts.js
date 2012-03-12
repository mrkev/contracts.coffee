
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
        used_arguments[i] = __contracts.use(arguments[i], "test/contracts.coffee");
      }
      ret = cb.apply(this, used_arguments);
      return __contracts.setExported(ret, "test/contracts.coffee");
    };

    if(!Array.isArray(deps)) {
      deps = wrapped_callback;
    }
    define(name, deps, wrapped_callback);
  };
} else if (typeof(require) !== 'undefined' && typeof(exports) !== 'undefined') {
  // we're using commonjs

  __exports = __contracts.exports("test/contracts.coffee", exports)
  __require = function(module) {
    module = require.apply(this, arguments);
    return __contracts.use(module, "test/contracts.coffee");
  };
}
  (function(define, require, exports) {
      var blames;

  blames = function(thunk, msg) {
    try {
      thunk();
      return fail("Blame was expected: " + msg);
    } catch (e) {
      if (e.cleaned_stacktrace != null) {
        return ok(true);
      } else {
        return fail("Not a blame error" + (msg ? ': ' + msg : ''));
      }
    }
  };

  test("function, first order", function() {
    var badRng, even, id, noarg, noarg_bad, option;
    id = __contracts.guard(__contracts.fun([Str], Str, {}),function(x) {
      return x;
    });
    eq(id("foo"), "foo", "abides by contract");
    throws((function() {
      return id(4);
    }), "violates domain");
    badRng = __contracts.guard(__contracts.fun([Str], Num, {}),function(x) {
      return x;
    });
    throws((function() {
      return badRng("foo");
    }), "violates range");
    option = __contracts.guard(__contracts.fun([Num, __contracts.opt(Str)], Bool, {}),function(n, s) {
      return true;
    });
    ok(option(42, "foo"), "optional abides by contract");
    ok(option(42), "does not include optional arg");
    throws((function() {
      return option(42, 42);
    }), "violates optional argument");
    even = __contracts.guard(__contracts.fun([
      (function(x) {
        return (x % 2) === 0;
      }).toContract()
    ], Num, {}),function(x) {
      return x;
    });
    eq(even(4), 4, "abides by contract");
    throws((function() {
      return even(3);
    }), "violates flat contract");
    noarg = __contracts.guard(__contracts.fun([], Num, {}),function() {
      return 42;
    });
    eq(noarg(), 42, "abides by contract");
    noarg_bad = __contracts.guard(__contracts.fun([], Num, {}),function() {
      return "foo";
    });
    return throws((function() {
      return noarg_bad();
    }), "violates contract");
  });

  test("function, higher order", function() {
    var bad_ho_dom, bad_ho_rng, giveStr, giveTrue, ho, ho_paren;
    ho = __contracts.guard(__contracts.fun([__contracts.fun([Str], Bool, {})], Bool, {}),function(f) {
      return f("foo");
    });
    giveTrue = function(s) {
      return true;
    };
    giveStr = function(s) {
      return "foo";
    };
    ok(ho(giveTrue), "abides by contract");
    throws((function() {
      return ho(giveStr);
    }), "f violates contract on its range");
    bad_ho_dom = __contracts.guard(__contracts.fun([__contracts.fun([Str], Bool, {})], Bool, {}),function(f) {
      return f(true);
    });
    throws((function() {
      return bad_ho_dom(giveTrue);
    }), "f's domain contract violated");
    bad_ho_rng = __contracts.guard(__contracts.fun([__contracts.fun([Str], Bool, {})], Bool, {}),function(f) {
      f("foo");
      return "foo";
    });
    throws((function() {
      return bad_ho_rng(giveTrue);
    }), "bad_ho_range violates its range");
    ho_paren = __contracts.guard(__contracts.fun([__contracts.fun([Num], Bool, {}), Num], Bool, {}),function(f, n) {
      return f(n);
    });
    eq(ho_paren((function(n) {
      return true;
    }), 42), true, "abides by contract");
    return throws((function() {
      return ho_paren((function(n) {
        return n;
      }), 42);
    }), "violates contract");
  });

  test("function, call/new only", function() {
    var callOnly, newOnly, x;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      callOnly = __contracts.guard(__contracts.fun([Num], Num, {
        callOnly: true
      }),function(x) {
        return x;
      });
      eq(callOnly(4), 4, "abides by contract");
      throws((function() {
        return new callOnly(4);
      }), Error, "violates contract by calling new");
      newOnly = __contracts.guard(__contracts.fun([Num], __contracts.object({
        a: Num
      }, {}), {
        newOnly: true
      }),function(x) {
        return this.a = x;
      });
      x = new newOnly(42);
      eq(x.a, 42, "abides by contract");
      return throws((function() {
        return newOnly(42);
      }), "violates contract by not calling new");
    }
  });

  test("function, dependent", function() {
    var bad_inc, inc, neg;
    inc = __contracts.guard(__contracts.fun([Num], function($1) { return (function(result) {
      return result > $1;
    }).toContract(); }, {}),function(x) {
      return x + 1;
    });
    eq(inc(42), 43, "abides by contract");
    bad_inc = __contracts.guard(__contracts.fun([Num], function($1) { return (function(result) {
      return result > $1;
    }).toContract(); }, {}),function(x) {
      return x - 1;
    });
    throws((function() {
      return bad_inc(42);
    }), "violates dependent contract");
    bad_inc = __contracts.guard(__contracts.fun([Str, Num], function($1, $2) { return (function(result) {
      return result > $2;
    }).toContract(); }, {}),function(x, y) {
      return y - 1;
    });
    throws((function() {
      return bad_inc("foo", 42);
    }), "violates multi arg dependent contract");
    neg = __contracts.guard(__contracts.fun([__contracts.or(Bool, Num)], function($1) { return (function(r) {
      return typeof r === typeof $1;
    }).toContract(); }, {}),function(x) {
      if (typeof x === 'number') {
        return 0 - x;
      } else {
        return !x;
      }
    });
    eq(neg(100), -100);
    return eq(neg(true), false);
  });

  test("function, this contract", function() {
    var bad_o, f, o;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      f = __contracts.guard(__contracts.fun([Str], Str, {
        this: __contracts.object({
          name: Str
        }, {})
      }),function(x) {
        return this.name + x;
      });
      o = {
        name: "Bob",
        append: f
      };
      eq(o.append(", Hiya!"), "Bob, Hiya!", "abides by contract");
      throws((function() {
        return f("foo");
      }), "violates this contract");
      bad_o = {
        name: 42,
        append: f
      };
      return throws((function() {
        return bad_o.append("foo");
      }), "violates this contract");
    }
  });

  test("objects, simple properties", function() {
    var o;
    o = __contracts.guard(__contracts.object({
      a: Str,
      b: Num
    }, {}),{
      a: "foo",
      b: 42
    });
    eq(o.a, "foo", "get abides by contract");
    eq(o.b, 42, "get abides by contract");
    ok(o.a = "bar", "set abides by contract");
    throws((function() {
      return o.a = 42;
    }), "set violates contract");
    throws((function() {
      var o_construct_bad;
      return o_construct_bad = __contracts.guard(__contracts.object({
        a: Num,
        b: Bool
      }, {}),{
        a: 42
      });
    }), "missing property guarenteed in contract");
    o = __contracts.guard(__contracts.object({
      a: Str,
      b: Num
    }, {}),{
      a: "foo",
      b: 42
    });
    eq(o.a, "foo", "get abides by contract");
    eq(o.b, 42, "get abides by contract");
    ok(o.a = "bar", "set abides by contract");
    throws((function() {
      return o.a = 42;
    }), "set violates contract");
    throws((function() {
      var o_construct_bad;
      return o_construct_bad = __contracts.guard(__contracts.object({
        a: Num,
        b: Bool
      }, {}),{
        a: 42
      });
    }), "missing property guarenteed in contract");
    o = __contracts.guard(__contracts.object({
      a: Str,
      b: __contracts.opt(Num)
    }, {}),{
      a: "foo"
    });
    eq(o.a, "foo", "get abides by contract");
    ok((o.b = 42), "set abides by contract");
    return throws((function() {
      return o.b = "foo";
    }), "set violates contract");
  });

  test("objects, props with functions", function() {
    var o, o_bad, obj;
    o = __contracts.guard(__contracts.object({
      a: __contracts.fun([Str], Num, {}),
      b: Bool
    }, {}),{
      a: function(s) {
        return 42;
      },
      b: false
    });
    eq(o.a("foo"), 42, "abides by contract");
    throws((function() {
      return o.a(42);
    }), "violates contract in domain");
    o_bad = __contracts.guard(__contracts.object({
      a: __contracts.fun([Str], Num, {}),
      b: Bool
    }, {}),{
      a: function(s) {
        return s;
      },
      b: false
    });
    throws((function() {
      return o_bad.a("foo");
    }), "violates contract in range");
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      obj = __contracts.guard(__contracts.object({
        a: Num,
        b: Str,
        f: __contracts.fun([Num], Num, {
          pre: function(o) {
            return o.a > 10;
          },
          post: function(o) {
            return o.b === "foo";
          }
        })
      }, {
        invariant: function() {
          return this.a > 0 && this.b === "foo";
        }
      }),{
        a: 1,
        b: "foo",
        f: function(x) {
          if (x === 44) this.a = -1;
          if (x === 22) this.b = "bar";
          return x + 10;
        }
      });
      throws((function() {
        return obj.f(11);
      }), "precondition is violated");
      obj.a = 11;
      eq(obj.f(11), 21, "all contracts are passed");
      throws((function() {
        return obj.b = "bar";
      }), "violates invariant by set");
      throws((function() {
        return obj.f(22);
      }), "postcondition is violated");
      obj.b = "foo";
      return throws((function() {
        return obj.f(44);
      }), "object invariant is violated");
    }
  });

  test("objects, nested", function() {
    var o;
    o = __contracts.guard(__contracts.object({
      a: __contracts.object({
        z: Num
      }, {}),
      b: Bool
    }, {}),{
      a: {
        z: 42
      },
      b: true
    });
    eq(o.a.z, 42, "get abides by contract");
    throws((function() {
      return o.a.z = "foo";
    }), "set violates contract");
    o = __contracts.guard(__contracts.object({
      a: Num,
      b: Str
    }, {}),{
      a: 42,
      b: "foo"
    });
    eq(o.a, 42, "newline syntax works fine for get");
    return throws((function() {
      return o.a = "foo";
    }), "newline syntax works fine for set");
  });

  test("objects, recursive", function() {
    var obj;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      obj = __contracts.guard(__contracts.object({
        a: Num,
        b: Self,
        c: __contracts.fun([Num], Self, {})
      }, {}),{
        a: 42,
        b: null,
        c: (function(x) {
          return {
            a: "foo"
          };
        })
      });
      obj.b = obj;
      eq(obj.a, 42, "abides by contract");
      eq(obj.b.a, 42, "abides by recursive portion of contract");
      throws((function() {
        return obj.b.a = "foo";
      }), "violates contract");
      return throws((function() {
        return obj.c().a;
      }), "violates contract");
    }
  });

  test("arrays, basic", function() {
    var a;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      a = __contracts.guard(__contracts.arr([Num, Str]),[42, "foo"]);
      eq(a[0], 42, "array get abides by contract");
      throws((function() {
        return a[0] = "foo";
      }), "array set violates contract");
      a = __contracts.guard(__contracts.arr([Num, Str]),[42, "foo"]);
      eq(a[0], 42, "array get abides by contract");
      return throws((function() {
        return a[0] = "foo";
      }), "array set violates contract");
    }
  });

  test("arrays, nested", function() {
    var a;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      a = __contracts.guard(__contracts.arr([Num, __contracts.arr([Str, Bool])]),[42, ["foo", true]]);
      eq(a[1][0], "foo", "nested array get abides by contract");
      return throws((function() {
        return a[1][0] = 42;
      }), "nested array set violates contract");
    }
  });

  test("arrays, with rest operator", function() {
    var a, b;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      a = __contracts.guard(__contracts.arr([__contracts.___(Num)]),[42, 22, 24]);
      eq(a[0], 42, "array get abides by contract");
      throws((function() {
        return a[0] = "foo";
      }), "array set violates contract");
      b = __contracts.guard(__contracts.arr([Str, Num, __contracts.___(Bool)]),["foo", 42, false, true, false]);
      eq(b[0], "foo", "get abides by contract");
      eq(b[2], false, "get abides by contract");
      ok((b[0] = "bar"), "set abides by contract");
      ok((b[2] = true), "set abides by contract");
      throws((function() {
        return b[0] = 42;
      }), "set violates contract");
      throws((function() {
        return b[2] = "foo";
      }), "set violates contract");
      return throws((function() {
        var c;
        return c = __contracts.guard(__contracts.arr([__contracts.___(Bool), Str]),["foo", 42]);
      }), "cannot construct a contract with ... in anything other than the last position of the array");
    }
  });

  test("construct your own contracts", function() {
    var MyEven, NumId, id, idEven;
    NumId = __contracts.fun([Num], Num, {});
    id = __contracts.guard(NumId,function(x) {
      return x;
    });
    eq(id(42), 42, "abides by contract");
    throws((function() {
      return id("foo");
    }), "violates contract");
    id = __contracts.guard(__contracts.fun([
      (function(x) {
        return typeof x === 'number';
      }).toContract()
    ], Num, {}),function(x) {
      return x;
    });
    eq(id(42), 42, "abides by contract");
    throws((function() {
      return id("foo");
    }), "violates contract");
    MyEven = (function(x) {
      return x % 2 === 0;
    }).toContract();
    idEven = __contracts.guard(__contracts.fun([MyEven], MyEven, {}),function(x) {
      return x;
    });
    eq(idEven(4), 4, "abides by contract");
    throws((function() {
      return idEven(3);
    }), "violates contract");
    MyEven = function(x) {
      return x % 2 === 0;
    };
    idEven = __contracts.guard(__contracts.fun([(MyEven).toContract()], function($1) { return (MyEven).toContract(); }, {}),function(x) {
      return x;
    });
    eq(idEven(4), 4, "abides by contract");
    return throws((function() {
      return idEven(3);
    }), "violates contract");
  });

  test("various flat combinators (and, or, etc.)", function() {
    var f;
    f = __contracts.guard(__contracts.fun([Num], __contracts.or(Num, Bool), {}),function(x) {
      if (x === 2) {
        return 2;
      } else if (x === 3) {
        return false;
      } else {
        return "bad state";
      }
    });
    eq(f(2), 2, "abides by contract");
    eq(f(3), false, "abides by contract");
    throws((function() {
      return f(4);
    }), "violates contract");
    f = __contracts.guard(__contracts.fun([
      __contracts.and(Num, (function(x) {
        return x > 42;
      }).toContract())
    ], Num, {}),function(x) {
      return x;
    });
    eq(f(43), 43, "abides by contract");
    return throws((function() {
      return f(1);
    }), "violates contract");
  });

  test("binary search tree example", function() {
    var BST, bst, findInBst;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      BST = __contracts.or(Null, __contracts.object({
        node: Num,
        left: __contracts.or(Self, Null),
        right: __contracts.or(Self, Null)
      }, {
        invariant: function() {
          return (this.left === null || this.node > this.left.node) && (this.right === null || this.node < this.right.node);
        }
      }));
      bst = __contracts.guard(BST,{
        node: 10,
        left: {
          node: 4,
          left: null,
          right: null
        },
        right: {
          node: 12,
          left: null,
          right: null
        }
      });
      findInBst = __contracts.guard(__contracts.fun([BST, Num], Bool, {}),function(t, n) {
        if (t === null) {
          return false;
        } else {
          return (t.node === n) || (n < t.node ? findInBst(t.left, n) : void 0) || (n > t.node ? findInBst(t.right, n) : void 0);
        }
      });
      eq(findInBst(bst, 10), true, "node exists and abides by contract");
      eq(findInBst(bst, 12), true, "node exists and has to go down a level");
      eq(findInBst(bst, 20), false, "node does not exist in bst");
      bst.right.node = 0;
      throws((function() {
        return findInBst(bst, 100);
      }), "invariant is violated");
      return throws((function() {
        return bst.node = 0;
      }), "invariant is violated");
    }
  });

  test("classes should work too", function() {
    var Person, p;
    Person = __contracts.guard(__contracts.fun([Str], __contracts.object({
      name: __contracts.fun([Any], Str, {})
    }, {}), {
      newOnly: true
    }),(function() {

      function _Class(firstName) {
        this.firstName = firstName;
      }

      _Class.prototype.name = function() {
        return this.firstName;
      };

      return _Class;

    })());
    return p = new Person("bob");
  });

  test("object contracts and builtins", function() {
    var f;
    f = __contracts.guard(__contracts.fun([
      __contracts.object({
        foo: Str
      }, {})
    ], Str, {}),function(o) {
      return o.foo;
    });
    eq(f({
      foo: "bar"
    }), "bar", "correct object");
    return throws((function() {
      return f("string");
    }), "string instead of an object, but should complain about missing property");
  });

  test("object contracts on object-like primitives will blame", function() {
    var g;
    g = __contracts.guard(__contracts.fun([
      __contracts.object({
        toString: __contracts.fun([Any], Str, {})
      }, {})
    ], Str, {}),function(s) {
      return s.toString();
    });
    return throws((function() {
      return g("foo");
    }), "foo is a string but expects object");
  });

  test("array contract ... with or", function() {
    var Data, getData;
    Data = __contracts.arr([__contracts.___(__contracts.or(Num, Str))]);
    getData = __contracts.guard(__contracts.fun([Data], __contracts.or(Num, Str), {}),function(arr) {
      return arr[0];
    });
    eq(getData([1, 2, 3]), 1);
    eq(getData(["foo", 2, 3]), "foo");
    throws((function() {
      return getData([null, "string"]);
    }));
    throws((function() {
      return getData([{}, 1, 2, 3]);
    }));
    return throws((function() {
      return getData({
        test: [1, 2, 3]
      });
    }));
  });

  test("null values with obj contracts", function() {
    var a;
    a = __contracts.guard(__contracts.fun([
      __contracts.object({
        a: Str,
        b: Str
      }, {})
    ], Any, {}),function(b) {
      return console.log(b);
    });
    return blames((function() {
      return a(null);
    }));
  });

  test("dont touch the arguments object", function() {
    var a;
    a = __contracts.guard(__contracts.fun([Any], Any, {}),function(b) {
      return arguments.length;
    });
    return eq(a('b', 'c', 'd'), 3, "the arguments object should be untouched by a contract");
  });

  test("this contract on custom contracts", function() {
    var Cust, CustBad, f_bad, f_mult, f_single, o;
    Cust = __contracts.object({
      name: Str
    }, {});
    CustBad = __contracts.object({
      age: Num
    }, {});
    f_single = __contracts.guard(__contracts.fun([], Str, {
      this: Cust
    }),function() {
      return this.name;
    });
    f_mult = __contracts.guard(__contracts.fun([Str], Str, {
      this: Cust
    }),function(s) {
      return this.name;
    });
    f_bad = __contracts.guard(__contracts.fun([], Num, {
      this: CustBad
    }),function() {
      return this.age;
    });
    o = {
      name: "Bob",
      single: f_single,
      mult: f_mult,
      bad: f_bad
    };
    ok(o.single() === "Bob");
    ok(o.mult("foo") === "Bob");
    return blames((function() {
      return o.bad();
    }));
  });

  }).call(this, __define, __require, __exports);
}));