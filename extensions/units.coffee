secret = {}

# makeQuantity :: (Str, Num, Quantity) -> Quantity
makeQuantity = (u, i, n) ->
  h = Proxy.unProxy secret, n
  if i is 0
    n
  else if h and h.unit is u
    makeQuantity u, (h.index + i), h.value
  else if h and h.unit > u
    makeQuantity h.unit, h.index, (makeQuantity u, i, h.value)
  else
    Proxy.create {
      unit: u
      index: i
      value: n
      unary: (o) -> unaryOps[o] u, i, n
      left: (o, r) -> leftOps[o] u, i, n, r
      right: (o, l) -> rightOps[o] u, i, n, l
      test: -> n
    }, null, secret


unaryOps = 
  '-': (u, i, n) -> makeQuantity u, i, (-n)
  'typeof': (u, i, n) ->  typeof n

leftOps = 
  '+': (u, i, n, r) -> makeQuantity u, i, (n + (dropUnit u, i, r))
  '*': (u, i, n, r) -> makeQuantity u, i, (n * r)
  '/': (u, i, n, r) -> makeQuantity u, i, (n / r)
  '===': (u, i, n, r) -> n is (dropUnit u, i, r)

rightOps =
  '+': (u, i, n, l) -> throw "Unit mismatch"
  '*': (u, i, n, l) -> makeQuantity u, i, (l * n)
  '/': (u, i, n, l) -> makeQuantity u, (-i), (l / n)
  '=': (u, i, n, l) -> false

# dropUnit :: (Str, Num, Quantity) -> Quantity
dropUnit = (u, i, n) ->
  h = Proxy.unProxy secret, n
  throw "bad units!" if not (h isnt false and h.unit is u and h.index is i)
  h.value

# exports.makeUnit :: (Str) -> Quantity
exports.makeUnit = makeUnit = (u) -> makeQuantity u, 1, 1