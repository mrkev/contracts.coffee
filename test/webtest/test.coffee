test "function, first order", ->
  id :: (Str) -> Str
  id = (x) -> x

  same (id "foo"), "foo", "abides by contract"
  raises (-> id 4), "violates domain"

  badRng :: (Str) -> Num
  badRng = (x) -> x

  raises (-> badRng "foo"), "violates range"

  opt :: (Num, Str?) -> Bool
  opt = (n, s) -> true

  ok (opt 42, "foo"), "optional abides by contract"
  ok (opt 42), "does not include optional arg"

  raises (-> opt 42, 42), "violates optional argument"

  even :: ( !(x) -> (x % 2) == 0 ) -> Num
  even = (x) -> x

  same (even 4), 4, "abides by contract"
  raises (-> even 3), "violates flat contract"

test "function, higher order", ->
  ho :: ( (Str) -> Bool ) -> Bool
  ho = (f) -> f "foo"

  giveTrue = (s) -> true
  giveStr = (s) -> "foo"

  ok (ho giveTrue), "abides by contract"
  raises (-> ho giveStr), "f violates contract on its range"

  bad_ho_dom :: ( (Str) -> Bool ) -> Bool
  bad_ho_dom = (f) -> f true

  raises (-> bad_ho_dom giveTrue), "f's domain contract violated"

  bad_ho_rng :: ( (Str) -> Bool ) -> Bool
  bad_ho_rng = (f) ->
    f "foo"
    "foo"

  raises (-> bad_ho_rng giveTrue), "bad_ho_range violates its range"

test "function, call/new only", ->
  callOnly :: (Num) --> Num
  callOnly = (x) -> x

  same (callOnly 4), 4, "abides by contract"
  raises (-> new callOnly 4), "violates contract by calling new"

  newOnly :: (Num) ==> { a: Num }
  newOnly = (x) -> @.a = x

  x = new newOnly 42
  same x.a, 42, "abides by contract"
  raises (-> newOnly 42), "violates contract by not calling new"

  newSafe :: (Num) -=> { a: Num }
  newSafe = (x) -> @.a = x

  withnew = new newSafe 42
  without = newSafe 42
  same without.a, 42, "abides by contract"
  same withnew.a, 42, "abides by contract"


test "function, dependent", ->
  inc :: (Num) -> !(result) -> result > $1
  inc = (x) -> x + 1

  same (inc 42), 43, "abides by contract"

  bad_inc :: (Num) -> !(result) -> result > $1
  bad_inc = (x) -> x - 1

  raises (-> bad_inc 42), "violates dependent contract"

  bad_inc :: (Str, Num) -> !(result) -> result > $2
  bad_inc = (x, y) -> y - 1

  raises (-> bad_inc "foo", 42), "violates multi arg dependent contract"

test "objects, simple properties", ->
  o :: { a: Str, b: Num }
  o =
    a: "foo"
    b: 42

  same o.a, "foo", "get abides by contract"
  same o.b, 42, "get abides by contract"

  ok o.a = "bar", "set abides by contract"
  raises (-> o.a = 42), "set violates contract"

  raises (->
    o_construct_bad :: { a: Num, b: Bool }
    o_construct_bad = a: 42 ), "missing property guarenteed in contract"

  o :: { a: Str, b: Num? }
  o =
    a: "foo"

  same o.a, "foo", "get abides by contract"
  ok (o.b = 42), "set abides by contract"
  raises (-> o.b = "foo"), "set violates contract"

test "objects, props with functions", ->
  o :: { a: ((Str) -> Num), b: Bool }
  o =
    a: (s) -> 42
    b: false

  same (o.a "foo"), 42, "abides by contract"
  raises (-> o.a 42), "violates contract in domain"

  o_bad :: { a: ((Str) -> Num), b: Bool }
  o_bad =
    a: (s) -> s
    b: false

  raises (-> o_bad.a "foo"), "violates contract in range"



test "objects, nested", ->
  o :: { a: {z: Num }, b: Bool }
  o =
    a:
      z: 42
    b: true

  same o.a.z, 42, "get abides by contract"
  raises (-> o.a.z = "foo"), "set violates contract"


  # todo: need to hack the lexer to add implicit '{'
  o :: {
    a: Num
    b: Str
  }
  o =
    a: 42
    b: "foo"

  same o.a, 42, "newline syntax works fine for get"
  raises (-> o.a = "foo"), "newline syntax works fine for set"

test "arrays, basic", ->
  a :: [Num, Str]
  a = [42, "foo"]

  same a[0], 42, "array get abides by contract"
  raises (-> a[0] = "foo"), "array set violates contract"


test "arrays, nested", ->
  a :: [Num, [Str, Bool]]
  a = [42, ["foo", true]]

  same a[1][0], "foo", "nested array get abides by contract"
  raises (-> a[1][0] = 42), "nested array set violates contract"

test "arrays, with rest operator", ->
  a :: [...Num]
  a = [42, 22, 24]

  same a[0], 42, "array get abides by contract"
  raises (-> a[0] = "foo"), "array set violates contract"

  b :: [Str, Num, ...Bool]
  b = ["foo", 42, false, true, false]

  same b[0], "foo", "get abides by contract"
  same b[2], false, "get abides by contract"
  ok (b[0] = "bar"), "set abides by contract"
  ok (b[2] = true), "set abides by contract"
  raises (-> b[0] = 42), "set violates contract"
  raises (-> b[2] = "foo"), "set violates contract"


# test "construct your own contracts", ->
#   NumId ::= (Num) -> Num
#   # Neg = !(x) -> x < 0
