
test "function, simple first order", ->
  id <::> (Num) -> Num
  id = (x) -> x
  eq (id 4), 4

test "function, higher order in params", ->
  id <::> ( ((Num) -> Str), Bool ) -> Num
  id = (x) -> x

  eq (id 4), 4

# test "function, higher order in params, implicit parens", ->
#   id <::> ( (Num) -> Str, Bool ) -> Num
#   id = (x) -> x

#   eq (id 4), 4

test "function, higher order in range", ->
  id <::> (Num) -> (Str) -> Bool
  id = (x) -> x
  eq (id 4), 4
