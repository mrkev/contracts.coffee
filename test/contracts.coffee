
test "simple assign, function", ->
  id <::> 42
  id = (x) -> x
  eq (id 4), 4

test "simple assign, function indent", ->
  id <::>
    42
  id =
    (x) -> x

  eq (id 4), 4

