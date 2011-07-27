
test "function, simple first order", ->
  id :: (Num) -> Num
  id = (x) -> x
  eq (id 4), 4

test "function, higher order in params", ->
  id :: ( ((Num) -> Str), Bool ) -> Num
  id = (x) -> x

  eq (id 4), 4

# test "function, higher order in params, implicit parens", ->
#   id <::> ( (Num) -> Str, Bool ) -> Num
#   id = (x) -> x

#   eq (id 4), 4

test "function, higher order in range", ->
  id :: (Num) -> (Str) -> Bool
  id = (x) -> x
  eq (id 4), 4

test "object, simple props", ->
  id :: { a: Num, b: Str }
  id =
    a: 42
    b: "foo"
  eq id.a, 42

test "object, function props", ->
  id :: { a: ( (Num) -> Num ), b: Str }
  id =
    a: (x) -> x
    b: "foo"
  eq (id.a 42), 42

test "array, simple props", ->
  id :: [Num, Str]
  id = [42, "foo"]
  eq id[0], 42

# test "array, function props", ->
#   id :: [ ((Num) -> Num), Str]
#   id = [(x) -> x, "foo"]
#   eq (id[0] 42), 42

# todo make a test that catches
# a :: C
# b = C
# idents need to match up
