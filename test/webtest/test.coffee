test "function, first order", ->
  id :: (Str) -> Str
  id = (x) -> x

  id = id.use()
  same (id "foo"), "foo", "abides by contract"
  raises (-> id 4), "violates domain"

  badRng :: (Str) -> Num
  badRng = (x) -> x

  raises (-> badRng "foo"), "violates range"

  opt :: (Num, Str?) -> Bool
  opt = (n, s) -> true

  opt = opt.use()

  ok (opt 42, "foo"), "optional abides by contract"
  ok (opt 42), "does not include optional arg"

  raises (-> opt 42, 42), "violates optional argument"

  even :: ( !(x) -> (x % 2) == 0 ) -> Num
  even = (x) -> x
  even = even.use()

  same (even 4), 4, "abides by contract"
  raises (-> even 3), "violates flat contract"

  noarg :: -> Num
  noarg = -> 42
  noarg = noarg.use()

  same noarg(), 42, "abides by contract"

  noarg_bad :: -> Num
  noarg_bad = -> "foo"

  raises (-> noarg_bad()), "violates contract"

test "function, higher order", ->
  ho :: ( (Str) -> Bool ) -> Bool
  ho = (f) -> f "foo"
  ho = ho.use()

  giveTrue = (s) -> true
  giveStr = (s) -> "foo"

  ok (ho giveTrue), "abides by contract"
  raises (-> ho giveStr), "f violates contract on its range"

  bad_ho_dom :: ( (Str) -> Bool ) -> Bool
  bad_ho_dom = (f) -> f true
  bad_ho_dom = bad_ho_dom.use()

  raises (-> bad_ho_dom giveTrue), "f's domain contract violated"

  bad_ho_rng :: ( (Str) -> Bool ) -> Bool
  bad_ho_rng = (f) ->
    f "foo"
    "foo"
  bad_ho_rng = bad_ho_rng.use()

  raises (-> bad_ho_rng giveTrue), "bad_ho_range violates its range"

  ho_paren :: ( (Num) -> Bool, Num ) -> Bool
  ho_paren = (f, n) -> f n
  ho_paren = ho_paren.use()

  same (ho_paren ((n) -> true), 42), true, "abides by contract"
  raises (-> ho_paren ((n) -> n), 42), "violates contract"

test "function, call/new only", ->
  callOnly :: (Num) --> Num
  callOnly = (x) -> x
  callOnly = callOnly.use()

  same (callOnly 4), 4, "abides by contract"
  raises (-> new callOnly 4), "violates contract by calling new"

  newOnly :: (Num) ==> { a: Num }
  newOnly = (x) -> @.a = x
  newOnly = newOnly.use()

  x = new newOnly 42
  same x.a, 42, "abides by contract"
  raises (-> newOnly 42), "violates contract by not calling new"

  newSafe :: (Num) -=> { a: Num }
  newSafe = (x) -> @.a = x
  newSafe = newSafe.use()

  withnew = new newSafe 42
  without = newSafe 42
  same without.a, 42, "abides by contract"
  same withnew.a, 42, "abides by contract"


test "function, dependent", ->
  # gt = (result) -> result > $1

  # inc :: (Num) -> !gt

  inc :: (Num) -> !(result) -> result > $1
  inc = (x) -> x + 1
  inc = inc.use()

  same (inc 42), 43, "abides by contract"

  bad_inc :: (Num) -> !(result) -> result > $1
  bad_inc = (x) -> x - 1
  bad_inc = bad_inc.use()

  raises (-> bad_inc 42), "violates dependent contract"

  bad_inc :: (Str, Num) -> !(result) -> result > $2
  bad_inc = (x, y) -> y - 1
  bad_inc = bad_inc.use()

  raises (-> bad_inc "foo", 42), "violates multi arg dependent contract"

test "function, this contract", ->
  f :: (Str, @{name: Str}) -> Str
  f = (x) -> @.name + x
  f = f.use()

  o =
    name: "Bob"
    append: f

  same (o.append ", Hiya!"), "Bob, Hiya!", "abides by contract"
  raises (-> f "foo"), "violates this contract"

  bad_o =
    name: 42
    append: f

  raises (-> bad_o.append "foo"), "violates this contract"


test "objects, simple properties", ->
  o :: { a: Str, b: Num }
  o =
    a: "foo"
    b: 42
  o = o.use()

  same o.a, "foo", "get abides by contract"
  same o.b, 42, "get abides by contract"

  ok o.a = "bar", "set abides by contract"
  raises (-> o.a = 42), "set violates contract"

  raises (->
    o_construct_bad :: { a: Num, b: Bool }
    o_construct_bad = a: 42
    o_construct_bad.use()), "missing property guarenteed in contract"

  o ::
    a: Str
    b: Num
  o =
    a: "foo"
    b: 42
  o = o.use()

  same o.a, "foo", "get abides by contract"
  same o.b, 42, "get abides by contract"

  ok o.a = "bar", "set abides by contract"
  raises (-> o.a = 42), "set violates contract"

  raises (->
    o_construct_bad :: { a: Num, b: Bool }
    o_construct_bad = a: 42
    o_construct_bad.use()), "missing property guarenteed in contract"

  o :: { a: Str, b: Num? }
  o =
    a: "foo"
  o = o.use()

  same o.a, "foo", "get abides by contract"
  ok (o.b = 42), "set abides by contract"
  raises (-> o.b = "foo"), "set violates contract"

test "objects, props with functions", ->
  o :: { a: ((Str) -> Num), b: Bool }
  o =
    a: (s) -> 42
    b: false
  o = o.use()

  same (o.a "foo"), 42, "abides by contract"
  raises (-> o.a 42), "violates contract in domain"

  o_bad :: { a: ((Str) -> Num), b: Bool }
  o_bad =
    a: (s) -> s
    b: false
  o_bad = o_bad.use()

  raises (-> o_bad.a "foo"), "violates contract in range"

  obj :: {
    a: Num
    b: Str
    f: (Num) -> Num |
        pre: (o) -> o.a > 10
        post: (o) -> o.b is "foo"
    | invariant: ->
      @.a > 0 and @.b is "foo"
  }
  obj =
    a: 1
    b: "foo"
    f: (x) ->
      @.a = -1 if x is 44
      @.b = "bar" if x is 22
      x + 10
  obj = obj.use()


  raises (-> obj.f(11)), "precondition is violated"
  obj.a = 11;
  same obj.f(11), 21, "all contracts are passed"
  raises (-> obj.b = "bar"), "violates invariant by set"
  raises (-> obj.f(22)), "postcondition is violated"
  obj.b = "foo"
  raises (-> obj.f(44)), "object invariant is violated"

test "objects, nested", ->
  o :: { a: {z: Num }, b: Bool }
  o =
    a:
      z: 42
    b: true
  o = o.use()

  same o.a.z, 42, "get abides by contract"
  raises (-> o.a.z = "foo"), "set violates contract"


  o ::
    a: Num
    b: Str
  o =
    a: 42
    b: "foo"
  o = o.use()

  same o.a, 42, "newline syntax works fine for get"
  raises (-> o.a = "foo"), "newline syntax works fine for set"

test "objects, recursive", ->
  obj :: { a: Num, b: Self, c: (Num) -> Self}
  obj = { a: 42, b: null, c: ((x) -> {a: "foo"})}
  obj = obj.use()

  obj.b = obj

  same obj.a, 42, "abides by contract"
  same obj.b.a, 42, "abides by recursive portion of contract"

  raises (-> obj.b.a = "foo"), "violates contract"
  raises (-> obj.c().a), "violates contract"

test "arrays, basic", ->
  a :: [Num, Str]
  a = [42, "foo"]
  a = a.use()

  same a[0], 42, "array get abides by contract"
  raises (-> a[0] = "foo"), "array set violates contract"

  a:: [Num, Str] # since space is meaningful make sure this also is array contract not prototype
  a = [42, "foo"]
  a = a.use()

  same a[0], 42, "array get abides by contract"
  raises (-> a[0] = "foo"), "array set violates contract"


test "arrays, nested", ->
  a :: [Num, [Str, Bool]]
  a = [42, ["foo", true]]
  a = a.use()

  same a[1][0], "foo", "nested array get abides by contract"
  raises (-> a[1][0] = 42), "nested array set violates contract"

test "arrays, with rest operator", ->
  a :: [...Num]
  a = [42, 22, 24]
  a = a.use()

  same a[0], 42, "array get abides by contract"
  raises (-> a[0] = "foo"), "array set violates contract"

  b :: [Str, Num, ...Bool]
  b = ["foo", 42, false, true, false]
  b = b.use()

  same b[0], "foo", "get abides by contract"
  same b[2], false, "get abides by contract"
  ok (b[0] = "bar"), "set abides by contract"
  ok (b[2] = true), "set abides by contract"
  raises (-> b[0] = 42), "set violates contract"
  raises (-> b[2] = "foo"), "set violates contract"

  raises (->
    c :: [...Bool, Str]
    c = ["foo", 42]
    c.use()), "cannot construct a contract with ... in anything other than the last position of the array"


test "construct your own contracts", ->
  NumId = ?(Num) -> Num

  id :: NumId
  id = (x) -> x
  id = id.use()

  same (id 42), 42, "abides by contract"
  raises (-> id "foo"), "violates contract"

  id :: (!(x) -> typeof x is 'number') -> Num
  id = (x) -> x
  id = id.use()

  same (id 42), 42, "abides by contract"
  raises (-> id "foo"), "violates contract"

  MyEven = ?!(x) -> x % 2 is 0

  idEven :: (MyEven) -> MyEven
  idEven = (x) -> x
  idEven = idEven.use()

  same (idEven 4), 4, "abides by contract"
  raises (-> idEven 3), "violates contract"

  MyEven = (x) -> x % 2 is 0

  idEven :: (!MyEven) -> !MyEven
  idEven = (x) -> x
  idEven = idEven.use()

  same (idEven 4), 4, "abides by contract"
  raises (-> idEven 3), "violates contract"

test "various flat combinators (and, or, etc.)", ->
  f :: (Num) -> Num or Bool
  f = (x) ->
    if x is 2
      2
    else if x is 3
      false
    else
      "bad state"

  f = f.use()

  same (f 2), 2, "abides by contract"
  same (f 3), false, "abides by contract"
  raises (-> f 4), "violates contract"

  f :: ( Num and (!(x) -> x > 42) ) -> Num
  f = (x) -> x
  f = f.use()

  same (f 43), 43, "abides by contract"
  raises (-> f 1), "violates contract"

  # f :: (not Num) -> not Num
  # f = (x) -> x
  # f = f.use()

  # same (f "foo"), "foo", "abides by contract"
  # raises (-> f 1), "violates contract"


test "binary search tree example", ->
  BST = ?(Null or {
      node: Num
      left: (Self or Null)
      right: (Self or Null)
      | invariant: ->
        console.log "invariant testing..."
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
  bst = bst.use()

  findInBst :: (BST, Num) -> Bool
  findInBst = (t, n) ->
    if t is null
      false
    else
      (t.node is n) or (findInBst t.left, n if n < t.node) or (findInBst t.right, n if n > t.node)
  findInBst = findInBst.use()

  same (findInBst bst, 10), true, "node exists and abides by contract"
  # same (findInBst bst, 12), true, "node exists and has to go down a level"
  # same (findInBst bst, 20), false, "node does not exist in bst"

  # bst.right.node = 0 # invariant is volated but no signal yet
  # raises (-> findInBst bst, 100), "invariant is violated"
  # raises (-> bst.node = 0) , "invariant is violated"

  # bad_bst =
  #   node: 10
  #   left:
  #     node: 50
  #     left: null
  #     right: null
  #   right:
  #     node: 100
  #     left: null
  #     right: null

  # findInBst






