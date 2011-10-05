test "function, simple first order", ->
  id :: (Num) -> Num
  id = (x) -> x
  id = id.use()

  eq (id 4), 4

test "function violates contract", ->
	id :: (Num) -> Num
	id = (x) -> x
	id = id.use()

	throws (-> id "foo"), Error

test "function, higher order in params", ->
  id :: ( ((Num) -> Str), Bool ) -> Num
  id = (x) -> x
  id = id.use()

  throws (-> id 4), null

test "function, higher order in params, implicit parens", ->
  id :: ( (Num) -> Str, Bool ) -> Num
  id = (x) -> x
  id = id.use()

  throws (-> id 4), null

test "function, higher order in range", ->
  id :: (Num) -> (Str) -> Bool
  id = (x) -> x
  id = id.use()

  throws (-> id 4), null

test "object, simple props", ->
  id :: { a: Num, b: Str }
  id =
    a: 42
    b: "foo"
  id = id.use()
  eq id.a, 42

test "object, function props", ->
  id :: { a: ( (Num) -> Num ), b: Str }
  id =
    a: (x) -> x
    b: "foo"
  id = id.use()

  eq (id.a 42), 42

# test "array, simple props", ->
#   id :: [Num, Str]
#   id = [42, "foo"]
#   id = id.use()

#   eq id[0], 42

# test "array, function props", ->
#   id :: [ ((Num) -> Num), Str]
#   id = [((x) -> x), "foo"]
#   id = id.use()

#   eq (id[0] 42), 42

