{i} = require '../../lib/extensions/complex'
{makeUnit} = require '../../lib/extensions/units'
{values, bind} = require '../../lib/extensions/multiple-values'
{defgeneric, defmethod} = require '../../lib/extensions/generic-functions'
{deffun} = require '../../lib/extensions/function-operators'
{list, head, tail, split} = require '../../lib/extensions/list'

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
  x = 4 + 1 * i
  y = 3 + 1 * i
  z = 7 + 2 * i

  ok (x + y) is z

test "multiple values basics", ->
  v = values 2,3
  [x, y] = bind v

  ok v is 2
  ok x is 2
  ok y is 3

test "multiple values with functions", ->
  polar = (x, y) ->
    values (Math.sqrt (x * x) + (y * y)), (Math.atan2 y, x)
  
  ok (polar 3.0, 4.0) is 5.0
  [r, theta] = bind (polar 3.0, 4.0)
  ok r is 5.0
  ok theta is 0.9272952180016122

test "generic functions", ->
  keyInput = do defgeneric
  defmethod keyInput, ((keyName) -> keyName is "escape"), (keyName) ->
    "quit!"
  defmethod keyInput, ((keyName) -> keyName is "enter"), (keyName) ->
    "do it!"  

  ok (keyInput "escape") is "quit!"
  ok (keyInput "enter") is "do it!"

test "function operators", ->
  f = deffun (x) -> x * x
  g = deffun (x) -> x + 10

  ok ((f + g) 10) is 400
  ok ((g + f) 10) is 110

  curried = deffun (x,y,z) -> x + y + z
  c1 = curried 1
  c2 = c1 2
  c3 = c2 3

  ok c3 is 6

test "lists", ->
  a = list [1,2,3]
  b = list [4,5,6]

  ok (a + b) is (list [1,2,3,4,5,6])

  h = head a
  t = tail a
  ok h is 1
  ok t is (list [2,3])

  [hd, tl] = split a
  ok hd is 1
  ok tl is (list [2,3])

test "units extension", ->
  meter = makeUnit 'meter'
  second = makeUnit 'second'
  g = 9.81 * meter / second / second
  throws (-> g + 1)