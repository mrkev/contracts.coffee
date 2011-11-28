require('../../src/loadVirt').patch()
fj = require "../../lib/extensions/flapjax"
frp = require "../../lib/extensions/frp"

id = (x) -> x

test "basic usage of core flapjax", ->
  # n = fj.createNode [], id
  # console.log n
  nowB = fj.timerB 1000
  time = nowB.valueNow()
  console.log time
  fj.disableTimer nowB
 
test "flapjax via virtual values", ->
  x = frp.reactive 5
  y = x + 5

  ok (x.curr() is 5), "x is 5"
  ok (y.curr() is 10), "y is 10"
  x.set 10
  ok (x.curr() is 10), "x is 10"
  ok (y.curr() is 15), "y is 15"