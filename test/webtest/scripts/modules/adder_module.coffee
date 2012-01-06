define [], ->
  add :: (Num) -> Pos
  add = (x) -> x + 10

  add: add


# so how do we support:
#
# exports ::
#   add: (Num) -> Pos
# exports =
#   add: (x) -> x + 10
# return exports