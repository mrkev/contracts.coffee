require('../../src/loadVirt').patch()
fj = require "../../lib/extensions/flapjax"

id = (x) -> x

test "basic loading", ->
  # n = fj.createNode [], id
  # console.log n
  nowB = fj.timerB 1000
  time = nowB.valueNow()
  console.log time
  fj.disableTimer nowB
 
