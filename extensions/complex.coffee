secret = {}

unaryOps =
  '-': (r, i) -> makeComplex -r, -i
  'typeof': (r, i) -> 'number'

binOps =
  '+': (r1, i1, r2, i2) -> makeComplex (r1 + r2), (i1 + i2)
  '*': (r1, i1, r2, i2) -> makeComplex (r1 * r2 - i1 * i2), (i1 * r2 + r1 * i2)
  '===': (r1, i1, r2, i2) -> (r1 is r2) and (i1 is i2)

# exports.makeComplex :: (Num, Num) -> Complex
exports.makeComplex = makeComplex = (r, i) ->
  h =
    real: r
    imag: i
    unary: (o) -> unaryOps[o] r, i
    left: (o, right) ->
      h = Proxy.unProxy secret, right
      if h
        binOps[o] r, i, h.real, h.imag
      else
        binOps[o] r, i, y, 0
    right: (o, left) ->
      binOps[o] left, 0, r, i
    test: -> true
    getPropertyDescriptor: (name) -> undefined
    # todo: need the identity forms. perhaps a good time to 
    # look into direct proxy?
  Proxy.create h, null, secret

# exports.isComplex :: (Any) -> Bool
exports.isComplex = isComplex = (x) -> if (Proxy.unProxy secret, x) then true else false

# Complex
exports.i = makeComplex 0, 1