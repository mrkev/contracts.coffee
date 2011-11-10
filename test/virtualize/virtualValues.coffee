complex = require '../../lib/extensions/complex'
units = require '../../lib/extensions/units'
mv = require '../../lib/extensions/multiple-values'

# note, don't use built in equality testing functions (eq, equals, etc.) since
# these will not be trapped (Cakefile can't be run through the virtualization process
# and the node builtins as well). Do the normal tests and then ok the resulting bool.

# simple identity proxy on numbers
makeVNum = (n) ->
  unaryOps =
    '-': (v) -> -v
  binaryOps =
    '+': (a, b) -> a + b
    '-': (a, b) -> a - b
    '/': (a, b) -> a / b
    '*': (a, b) -> a * b

  h = 
    value: n
    unary: (op) -> unaryOps[op] @.value
    left: (op, right) -> binaryOps[op] @.value, right
    right: (op, left) -> binaryOps[op] left, @.value
    get: (myprox, name) ->
      throw "Not defined"
  Proxy.create h, null, {}
        
# simple identity proxy on booleans
makeVBool = (b) ->
  h =
    value: b
    test: -> @.value
    get: (myproxy, name) ->
      throw "Not defined"

  Proxy.create h, null, {}

test "virtual numbers, operations are identity", ->
  p = makeVNum 10
  q = makeVNum 20

  # unary operations
  ok -p is -10

  # binary left operations
  ok (p - 2) is 8
  ok (p + 2) is 12
  ok (p / 2) is 5
  ok (p * 2) is 20

  # binary right operations
  ok (20 + p) is 30
  ok (20 - p) is 10
  ok (20 / p) is 2
  ok (20 * p) is 200

  # binary operations, both proxy
  ok (q + p) is 30
  ok (q - p) is 10
  ok (q / p) is 2
  ok (q * p) is 200

test "virtual booleans, various forms of if", ->
  bt = makeVBool true
  bf = makeVBool false

  if bt
    ok true
  else
    fail "should not get the false branch"
  
  if bf
    fail "should not get the true branch"
  else
    ok true

  x = if bt then ok true else fail "should not get the false branch"
  x = if bf then fail "should not get the true branch" else ok true

test "complex numbers", ->
  x = 4 + 1 * complex.i
  y = 3 + 1 * complex.i
  z = 7 + 2 * complex.i

  ok (x + y) is z

test "multiple values basics", ->
  v = mv.values 2,3
  [x, y] = mv.bind v

  ok v is 2
  ok x is 2
  ok y is 3

test "multiple values with functions", ->
  polar = (x, y) ->
    mv.values (Math.sqrt (x * x) + (y * y)), (Math.atan2 y, x)
  
  [r, theta] = mv.bind (polar 3.0, 4.0)
  ok r is 5.0
  ok theta is 0.9272952180016122

test "units extension", ->
  meter = units.makeUnit 'meter'
  second = units.makeUnit 'second'
  g = 9.81 * meter / second / second
  throws (-> g + 1)