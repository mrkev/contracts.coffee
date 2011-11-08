complex = require '../../lib/extensions/complex'
units = require '../../lib/extensions/units'

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
  eq (-p), -10

  # binary left operations
  eq (p - 2), 8
  eq (p + 2), 12
  eq (p / 2), 5
  eq (p * 2), 20

  # binary right operations
  eq (20 + p), 30
  eq (20 - p), 10
  eq (20 / p), 2
  eq (20 * p), 200

  # binary operations, both proxy
  eq (q + p), 30
  eq (q - p), 10
  eq (q / p), 2
  eq (q * p), 200

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

test "units extension", ->
  meter = units.makeUnit 'meter'
  second = units.makeUnit 'second'
  g = 9.81 * meter / second / second
  throws (-> g + 1)