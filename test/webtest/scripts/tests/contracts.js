(function() {
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
    id = function(x) {
      return x;
    };
    eq(id("foo"), "foo", "abides by contract");
    throws((function() {
      return id(4);
    }), "violates domain");
    badRng = function(x) {
      return x;
    };
    throws((function() {
      return badRng("foo");
    }), "violates range");
    option = function(n, s) {
      return true;
    };
    ok(option(42, "foo"), "optional abides by contract");
    ok(option(42), "does not include optional arg");
    throws((function() {
      return option(42, 42);
    }), "violates optional argument");
    even = function(x) {
      return x;
    };
    eq(even(4), 4, "abides by contract");
    throws((function() {
      return even(3);
    }), "violates flat contract");
    noarg = function() {
      return 42;
    };
    eq(noarg(), 42, "abides by contract");
    noarg_bad = function() {
      return "foo";
    };
    return throws((function() {
      return noarg_bad();
    }), "violates contract");
  });

  test("function, higher order", function() {
    var bad_ho_dom, bad_ho_rng, giveStr, giveTrue, ho, ho_paren;
    ho = function(f) {
      return f("foo");
    };
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
    bad_ho_dom = function(f) {
      return f(true);
    };
    throws((function() {
      return bad_ho_dom(giveTrue);
    }), "f's domain contract violated");
    bad_ho_rng = function(f) {
      f("foo");
      return "foo";
    };
    throws((function() {
      return bad_ho_rng(giveTrue);
    }), "bad_ho_range violates its range");
    ho_paren = function(f, n) {
      return f(n);
    };
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
      callOnly = function(x) {
        return x;
      };
      eq(callOnly(4), 4, "abides by contract");
      throws((function() {
        return new callOnly(4);
      }), Error, "violates contract by calling new");
      newOnly = function(x) {
        return this.a = x;
      };
      x = new newOnly(42);
      eq(x.a, 42, "abides by contract");
      return throws((function() {
        return newOnly(42);
      }), "violates contract by not calling new");
    }
  });

  test("function, dependent", function() {
    var bad_inc, inc, neg;
    inc = function(x) {
      return x + 1;
    };
    eq(inc(42), 43, "abides by contract");
    bad_inc = function(x) {
      return x - 1;
    };
    throws((function() {
      return bad_inc(42);
    }), "violates dependent contract");
    bad_inc = function(x, y) {
      return y - 1;
    };
    throws((function() {
      return bad_inc("foo", 42);
    }), "violates multi arg dependent contract");
    neg = function(x) {
      if (typeof x === 'number') {
        return 0 - x;
      } else {
        return !x;
      }
    };
    eq(neg(100), -100);
    return eq(neg(true), false);
  });

  test("function, this contract", function() {
    var bad_o, f, o;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      f = function(x) {
        return this.name + x;
      };
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
    o = {
      a: "foo",
      b: 42
    };
    eq(o.a, "foo", "get abides by contract");
    eq(o.b, 42, "get abides by contract");
    ok(o.a = "bar", "set abides by contract");
    throws((function() {
      return o.a = 42;
    }), "set violates contract");
    throws((function() {
      var o_construct_bad;
      return o_construct_bad = {
        a: 42
      };
    }), "missing property guarenteed in contract");
    o = {
      a: "foo",
      b: 42
    };
    eq(o.a, "foo", "get abides by contract");
    eq(o.b, 42, "get abides by contract");
    ok(o.a = "bar", "set abides by contract");
    throws((function() {
      return o.a = 42;
    }), "set violates contract");
    throws((function() {
      var o_construct_bad;
      return o_construct_bad = {
        a: 42
      };
    }), "missing property guarenteed in contract");
    o = {
      a: "foo"
    };
    eq(o.a, "foo", "get abides by contract");
    ok((o.b = 42), "set abides by contract");
    return throws((function() {
      return o.b = "foo";
    }), "set violates contract");
  });

  test("objects, props with functions", function() {
    var o, o_bad, obj;
    o = {
      a: function(s) {
        return 42;
      },
      b: false
    };
    eq(o.a("foo"), 42, "abides by contract");
    throws((function() {
      return o.a(42);
    }), "violates contract in domain");
    o_bad = {
      a: function(s) {
        return s;
      },
      b: false
    };
    throws((function() {
      return o_bad.a("foo");
    }), "violates contract in range");
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      obj = {
        a: 1,
        b: "foo",
        f: function(x) {
          if (x === 44) {
            this.a = -1;
          }
          if (x === 22) {
            this.b = "bar";
          }
          return x + 10;
        }
      };
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
    o = {
      a: {
        z: 42
      },
      b: true
    };
    eq(o.a.z, 42, "get abides by contract");
    throws((function() {
      return o.a.z = "foo";
    }), "set violates contract");
    o = {
      a: 42,
      b: "foo"
    };
    eq(o.a, 42, "newline syntax works fine for get");
    return throws((function() {
      return o.a = "foo";
    }), "newline syntax works fine for set");
  });

  test("objects, recursive", function() {
    var obj;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      obj = {
        a: 42,
        b: null,
        c: (function(x) {
          return {
            a: "foo"
          };
        })
      };
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
      a = [42, "foo"];
      eq(a[0], 42, "array get abides by contract");
      throws((function() {
        return a[0] = "foo";
      }), "array set violates contract");
      a = [42, "foo"];
      eq(a[0], 42, "array get abides by contract");
      return throws((function() {
        return a[0] = "foo";
      }), "array set violates contract");
    }
  });

  test("arrays, nested", function() {
    var a;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      a = [42, ["foo", true]];
      eq(a[1][0], "foo", "nested array get abides by contract");
      return throws((function() {
        return a[1][0] = 42;
      }), "nested array set violates contract");
    }
  });

  test("arrays, with rest operator", function() {
    var a, b;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      a = [42, 22, 24];
      eq(a[0], 42, "array get abides by contract");
      throws((function() {
        return a[0] = "foo";
      }), "array set violates contract");
      b = ["foo", 42, false, true, false];
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
        return c = ["foo", 42];
      }), "cannot construct a contract with ... in anything other than the last position of the array");
    }
  });

  test("construct your own contracts", function() {
    var MyEven, id, idEven;
    id = function(x) {
      return x;
    };
    eq(id(42), 42, "abides by contract");
    throws((function() {
      return id("foo");
    }), "violates contract");
    id = function(x) {
      return x;
    };
    eq(id(42), 42, "abides by contract");
    throws((function() {
      return id("foo");
    }), "violates contract");
    idEven = function(x) {
      return x;
    };
    eq(idEven(4), 4, "abides by contract");
    throws((function() {
      return idEven(3);
    }), "violates contract");
    MyEven = function(x) {
      return x % 2 === 0;
    };
    idEven = function(x) {
      return x;
    };
    eq(idEven(4), 4, "abides by contract");
    return throws((function() {
      return idEven(3);
    }), "violates contract");
  });

  test("various flat combinators (and, or, etc.)", function() {
    var f;
    f = function(x) {
      if (x === 2) {
        return 2;
      } else if (x === 3) {
        return false;
      } else {
        return "bad state";
      }
    };
    eq(f(2), 2, "abides by contract");
    eq(f(3), false, "abides by contract");
    throws((function() {
      return f(4);
    }), "violates contract");
    f = function(x) {
      return x;
    };
    eq(f(43), 43, "abides by contract");
    return throws((function() {
      return f(1);
    }), "violates contract");
  });

  test("binary search tree example", function() {
    var bst, findInBst;
    if (typeof inBrowser !== "undefined" && inBrowser !== null) {
      bst = {
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
      };
      findInBst = function(t, n) {
        if (t === null) {
          return false;
        } else {
          return (t.node === n) || (n < t.node ? findInBst(t.left, n) : void 0) || (n > t.node ? findInBst(t.right, n) : void 0);
        }
      };
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
    Person = (function() {

      function _Class(firstName) {
        this.firstName = firstName;
      }

      _Class.prototype.name = function() {
        return this.firstName;
      };

      return _Class;

    })();
    return p = new Person("bob");
  });

  test("object contracts and builtins", function() {
    var f;
    f = function(o) {
      return o.foo;
    };
    eq(f({
      foo: "bar"
    }), "bar", "correct object");
    return throws((function() {
      return f("string");
    }), "string instead of an object, but should complain about missing property");
  });

  test("object contracts on object-like primitives will blame", function() {
    var g;
    g = function(s) {
      return s.toString();
    };
    return throws((function() {
      return g("foo");
    }), "foo is a string but expects object");
  });

  test("array contract ... with or", function() {
    var getData;
    getData = function(arr) {
      return arr[0];
    };
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
    a = function(b) {
      return console.log(b);
    };
    return blames((function() {
      return a(null);
    }));
  });

  test("dont touch the arguments object", function() {
    var a;
    a = function(b) {
      return arguments.length;
    };
    return eq(a('b', 'c', 'd'), 3, "the arguments object should be untouched by a contract");
  });

  test("this contract on custom contracts", function() {
    var f_bad, f_mult, f_single, o;
    f_single = function() {
      return this.name;
    };
    f_mult = function(s) {
      return this.name;
    };
    f_bad = function() {
      return this.age;
    };
    return o = {
      name: "Bob",
      single: f_single,
      mult: f_mult,
      bad: f_bad
    };
  });

  if (typeof inBrowser !== "undefined" && inBrowser !== null) {
    ok(o.single() === "Bob");
    ok(o.mult("foo") === "Bob");
    blames((function() {
      return o.bad();
    }));
  }

}).call(this);