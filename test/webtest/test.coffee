test "function, first order", ->
  id :: (Str) -> Str
  id = (x) -> x

  same (id "foo"), "foo", "abides by contract"
  raises (-> id 4), "violates domain"

  badRng :: (Str) -> Num
  badRng = (x) -> x

  raises (-> badRng "foo"), "violates range"

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

test "objects, simple properties", ->
  o :: { a: Str, b: Num }
  o =
    a: "foo"
    b: 42

  same o.a, "foo", "get abides by contract"
  same o.b, 42, "get abides by contract"

  ok o.a = "bar", "set abides by contract"
  raises (-> o.a = 42), "set violates contract"

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

  raises (->
    o_construct_bad :: { a: ((Str) -> Num), b: Bool }
    o_construct_bad =  { a: (s) -> s }), "missing property guarenteed in contract"


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

