{makeIdHandler} = require './utils'
secret = {}
STOP = {}

id = (x) -> x

unaryOps = 
  '!': (x) -> !x
  '-': (x) -> -x

binaryOps =
  '+': (x, y) -> x + y
  '-': (x, y) -> x - y
  '*': (x, y) -> x * y
  '/': (x, y) -> x / y
  '===': (x, y) -> x is y

Reactive = ?!(x) -> if Proxy.unProxy secret, x then true else false
StopVal = ?!(x) -> x is STOP

makeReactive :: (Null or [...Reactive], (Any) -> Any or StopVal, Any?) -> Reactive
makeReactive = (source, update, value = null) ->
  handler = do makeIdHandler
  handler.sinks = []
  handler.value = value
  handler.update = update
  handler.sources = if source? then source else []

  p = Proxy.create handler, null, secret
  handler.left = (o, r) ->
      h = Proxy.unProxy secret, r
      if h
        throw "not implemented"
      else
        val = binaryOps[o] @.value, r
        upd = (t) -> binaryOps[o] t, r
        src = p
        makeReactive [src], upd, val
  handler.sources.forEach (s) ->
    h = Proxy.unProxy secret, s
    if h
      h.sinks.push p
    else
      throw "Source is not a reactive value!"
  p.set = (x) ->
    upd = handler.update x
    if upd isnt STOP
      handler.value = upd 
      s.set upd for s in handler.sinks
  p
makeReactive = makeReactive.use "self"



exports.reactive :: (Any) -> Reactive
exports.reactive = (x) -> makeReactive null, id, x
