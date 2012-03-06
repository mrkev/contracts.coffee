# requires recent "unstable" versions of node (v0.5.8+) to work

test "function, first order", ->
  id :: (Str) -> Str
  id = (x) -> x

  eq (id "foo"), "foo", "abides by contract"
  throws (-> id 4), "violates domain"

  badRng :: (Str) -> Num
  badRng = (x) -> x

  throws (-> badRng "foo"), "violates range"

  option :: (Num, Str?) -> Bool
  option = (n, s) -> true


  ok (option 42, "foo"), "optional abides by contract"
  ok (option 42), "does not include optional arg"

  throws (-> option 42, 42), "violates optional argument"

  even :: ( !(x) -> (x % 2) == 0 ) -> Num
  even = (x) -> x

  eq (even 4), 4, "abides by contract"
  throws (-> even 3), "violates flat contract"

  noarg :: -> Num
  noarg = -> 42

  eq noarg(), 42, "abides by contract"

  noarg_bad :: -> Num
  noarg_bad = -> "foo"

  throws (-> noarg_bad()), "violates contract"

test "function, higher order", ->
  ho :: ( (Str) -> Bool ) -> Bool
  ho = (f) -> f "foo"

  giveTrue = (s) -> true
  giveStr = (s) -> "foo"

  ok (ho giveTrue), "abides by contract"
  throws (-> ho giveStr), "f violates contract on its range"

  bad_ho_dom :: ( (Str) -> Bool ) -> Bool
  bad_ho_dom = (f) -> f true

  throws (-> bad_ho_dom giveTrue), "f's domain contract violated"

  bad_ho_rng :: ( (Str) -> Bool ) -> Bool
  bad_ho_rng = (f) ->
    f "foo"
    "foo"

  throws (-> bad_ho_rng giveTrue), "bad_ho_range violates its range"

  ho_paren :: ( (Num) -> Bool, Num ) -> Bool
  ho_paren = (f, n) -> f n

  eq (ho_paren ((n) -> true), 42), true, "abides by contract"
  throws (-> ho_paren ((n) -> n), 42), "violates contract"

test "function, call/new only", ->
	# todo: v8 proxies currently (node 0.5.8) don't support call vs constructor
	if inBrowser?
	  callOnly :: (Num) --> Num
	  callOnly = (x) -> x

	  eq (callOnly 4), 4, "abides by contract"
	  throws (-> new callOnly 4), Error, "violates contract by calling new"

	  newOnly :: (Num) ==> { a: Num }
	  newOnly = (x) -> @.a = x

	  x = new newOnly 42
	  eq x.a, 42, "abides by contract"
	  throws (-> newOnly 42), "violates contract by not calling new"

test "function, dependent", ->
  # gt = (result) -> result > $1

  # inc :: (Num) -> !gt

  inc :: (Num) -> !(result) -> result > $1
  inc = (x) -> x + 1

  eq (inc 42), 43, "abides by contract"

  bad_inc :: (Num) -> !(result) -> result > $1
  bad_inc = (x) -> x - 1

  throws (-> bad_inc 42), "violates dependent contract"

  bad_inc :: (Str, Num) -> !(result) -> result > $2
  bad_inc = (x, y) -> y - 1

  throws (-> bad_inc "foo", 42), "violates multi arg dependent contract"

  neg :: (Bool or Num) -> !(r) -> typeof r is typeof $1
  neg = (x) ->
    if typeof x is 'number'
      0 - x
    else
      !x

  eq (neg 100), -100
  eq (neg true), false

test "function, this contract", ->
	# v8 function proxies don't currently set `this` right
	if inBrowser?
	  f :: (Str, @{name: Str}) -> Str
	  f = (x) -> @.name + x

	  o =
	    name: "Bob"
	    append: f

	  eq (o.append ", Hiya!"), "Bob, Hiya!", "abides by contract"
	  throws (-> f "foo"), "violates this contract"

	  bad_o =
	    name: 42
	    append: f

	  throws (-> bad_o.append "foo"), "violates this contract"


test "objects, simple properties", ->
  o :: { a: Str, b: Num }
  o =
    a: "foo"
    b: 42

  eq o.a, "foo", "get abides by contract"
  eq o.b, 42, "get abides by contract"

  ok o.a = "bar", "set abides by contract"
  throws (-> o.a = 42), "set violates contract"

  throws (->
    o_construct_bad :: { a: Num, b: Bool }
    o_construct_bad = a: 42), "missing property guarenteed in contract"

  o ::
    a: Str
    b: Num
  o =
    a: "foo"
    b: 42

  eq o.a, "foo", "get abides by contract"
  eq o.b, 42, "get abides by contract"

  ok o.a = "bar", "set abides by contract"
  throws (-> o.a = 42), "set violates contract"

  throws (->
    o_construct_bad :: { a: Num, b: Bool }
    o_construct_bad = a: 42), "missing property guarenteed in contract"

  o :: { a: Str, b: Num? }
  o =
    a: "foo"

  eq o.a, "foo", "get abides by contract"
  ok (o.b = 42), "set abides by contract"
  throws (-> o.b = "foo"), "set violates contract"

test "objects, props with functions", ->
  o :: { a: ((Str) -> Num), b: Bool }
  o =
    a: (s) -> 42
    b: false

  eq (o.a "foo"), 42, "abides by contract"
  throws (-> o.a 42), "violates contract in domain"

  o_bad :: { a: ((Str) -> Num), b: Bool }
  o_bad =
    a: (s) -> s
    b: false

  throws (-> o_bad.a "foo"), "violates contract in range"

  # todo: v8 bugs...probably relating to `this`
  if inBrowser?
	  obj :: {
	    a: Num
	    b: Str
	    f: (Num) -> Num -|
	        pre: (o) -> o.a > 10
	        post: (o) -> o.b is "foo"
	    -| invariant: ->
	      @.a > 0 and @.b is "foo"
	  }
	  obj =
	    a: 1
	    b: "foo"
	    f: (x) ->
	      @.a = -1 if x is 44
	      @.b = "bar" if x is 22
	      x + 10


	  throws (-> obj.f(11)), "precondition is violated"
	  obj.a = 11;
	  eq obj.f(11), 21, "all contracts are passed"
	  throws (-> obj.b = "bar"), "violates invariant by set"
	  throws (-> obj.f(22)), "postcondition is violated"
	  obj.b = "foo"
	  throws (-> obj.f(44)), "object invariant is violated"

test "objects, nested", ->
  o :: { a: {z: Num }, b: Bool }
  o =
    a:
      z: 42
    b: true

  eq o.a.z, 42, "get abides by contract"
  throws (-> o.a.z = "foo"), "set violates contract"


  o ::
    a: Num
    b: Str
  o =
    a: 42
    b: "foo"

  eq o.a, 42, "newline syntax works fine for get"
  throws (-> o.a = "foo"), "newline syntax works fine for set"

test "objects, recursive", ->
	if inBrowser?
	  obj :: { a: Num, b: Self, c: (Num) -> Self}
	  obj = { a: 42, b: null, c: ((x) -> {a: "foo"})}

	  obj.b = obj

	  eq obj.a, 42, "abides by contract"
	  eq obj.b.a, 42, "abides by recursive portion of contract"

	  throws (-> obj.b.a = "foo"), "violates contract"
	  throws (-> obj.c().a), "violates contract"

test "arrays, basic", ->
	if inBrowser?
	  a :: [Num, Str]
	  a = [42, "foo"]

	  eq a[0], 42, "array get abides by contract"
	  throws (-> a[0] = "foo"), "array set violates contract"

	  a:: [Num, Str] # since space is meaningful make sure this also is array contract not prototype
	  a = [42, "foo"]

	  eq a[0], 42, "array get abides by contract"
	  throws (-> a[0] = "foo"), "array set violates contract"


test "arrays, nested", ->
	if inBrowser?
	  a :: [Num, [Str, Bool]]
	  a = [42, ["foo", true]]

	  eq a[1][0], "foo", "nested array get abides by contract"
	  throws (-> a[1][0] = 42), "nested array set violates contract"

test "arrays, with rest operator", ->
	if inBrowser?
	  a :: [...Num]
	  a = [42, 22, 24]

	  eq a[0], 42, "array get abides by contract"
	  throws (-> a[0] = "foo"), "array set violates contract"

	  b :: [Str, Num, ...Bool]
	  b = ["foo", 42, false, true, false]

	  eq b[0], "foo", "get abides by contract"
	  eq b[2], false, "get abides by contract"
	  ok (b[0] = "bar"), "set abides by contract"
	  ok (b[2] = true), "set abides by contract"
	  throws (-> b[0] = 42), "set violates contract"
	  throws (-> b[2] = "foo"), "set violates contract"

	  throws (->
	    c :: [...Bool, Str]
	    c = ["foo", 42]), "cannot construct a contract with ... in anything other than the last position of the array"


test "construct your own contracts", ->
  NumId = ?(Num) -> Num

  id :: NumId
  id = (x) -> x

  eq (id 42), 42, "abides by contract"
  throws (-> id "foo"), "violates contract"

  id :: (!(x) -> typeof x is 'number') -> Num
  id = (x) -> x

  eq (id 42), 42, "abides by contract"
  throws (-> id "foo"), "violates contract"

  MyEven = ?!(x) -> x % 2 is 0

  idEven :: (MyEven) -> MyEven
  idEven = (x) -> x

  eq (idEven 4), 4, "abides by contract"
  throws (-> idEven 3), "violates contract"

  MyEven = (x) -> x % 2 is 0

  idEven :: (!MyEven) -> !MyEven
  idEven = (x) -> x

  eq (idEven 4), 4, "abides by contract"
  throws (-> idEven 3), "violates contract"

test "various flat combinators (and, or, etc.)", ->
  f :: (Num) -> Num or Bool
  f = (x) ->
    if x is 2
      2
    else if x is 3
      false
    else
      "bad state"


  eq (f 2), 2, "abides by contract"
  eq (f 3), false, "abides by contract"
  throws (-> f 4), "violates contract"

  f :: ( Num and (!(x) -> x > 42) ) -> Num
  f = (x) -> x

  eq (f 43), 43, "abides by contract"
  throws (-> f 1), "violates contract"

  # f :: (not Num) -> not Num
  # f = (x) -> x

  # eq (f "foo"), "foo", "abides by contract"
  # throws (-> f 1), "violates contract"


test "binary search tree example", ->
	if inBrowser?
	  BST = ?(Null or {
	      node: Num
	      left: (Self or Null)
	      right: (Self or Null)
	      -| invariant: ->
	        (@.left is null or @.node > @.left.node) and
	        (@.right is null or @.node < @.right.node)
	    })

	  bst :: BST
	  bst =
	    node: 10
	    left:
	      node: 4
	      left: null
	      right: null
	    right:
	      node: 12
	      left: null
	      right: null

	  findInBst :: (BST, Num) -> Bool
	  findInBst = (t, n) ->
	    if t is null
	      false
	    else
	      (t.node is n) or (findInBst t.left, n if n < t.node) or (findInBst t.right, n if n > t.node)

	  eq (findInBst bst, 10), true, "node exists and abides by contract"
	  eq (findInBst bst, 12), true, "node exists and has to go down a level"
	  eq (findInBst bst, 20), false, "node does not exist in bst"

	  bst.right.node = 0 # invariant is volated but no signal yet
	  throws (-> findInBst bst, 100), "invariant is violated"
	  throws (-> bst.node = 0) , "invariant is violated"

# test "using patched require in node", ->
#   if not inBrowser?
#     idmod = require './modules/id'

#     eq (idmod.id "foo"), "foo"
#     throws (-> idmod.id 42)

test "object contracts and builtins", ->
  f :: ({foo: Str}) -> Str
  f = (o) ->
    o.foo

  eq (f {foo: "bar"}), "bar", "correct object"
  throws (-> f "string"), "string instead of an object, but should complain about missing property"

test "object contracts on object-like builtins (currently failing)", ->
  g :: ({toString: (Any) -> Str}) -> Str
  g = (s) -> s.toString()

  g "foo"

test "array contract ... with or", ->
  Data = ?([...Num or Str])

  getData :: (Data) -> Num or Str
  getData = (arr) -> arr[0]

  eq (getData [1,2,3]), 1
  eq (getData ["foo",2,3]), "foo"

  throws (-> getData [null, "string"])
  throws (-> getData [{},1,2,3])
  throws (-> getData {test:[1,2,3]})
