if require?
  {makeIdHandler, merge, numUnaryOps, numBinaryOps} = require './utils'
else
  {makeIdHandler, merge, numUnaryOps, numBinaryOps} = utils

reactiveSecret = {}
streamSecret = {}

root = global ? this

wrapGet = (that, prop) ->
  if prop instanceof Behavior
    reactive prop
  if prop instanceof EventStream
    stream prop
  else if typeof prop is 'function'
    (args...) ->
      r = prop.apply that, (for arg in args
        rh = Proxy.unProxy reactiveSecret, arg
        sh = Proxy.unProxy streamSecret, arg
        if rh then rh.beh else if sh then sh.evt else arg)

      if r instanceof Behavior 
        reactive r 
      else if r instanceof EventStream
        stream r
      else 
        r
  else
    prop

reactive = (x) -> 
  b = if x instanceof Behavior then x else startsWith receiverE(), x

  handler = merge (makeIdHandler b),
    beh: b
    get: (r, name) -> wrapGet handler.beh, handler.beh[name]
    unary: (o) -> reactive (liftB numUnaryOps[o], @.beh)
    left: (o, r) ->
      h = Proxy.unProxy reactiveSecret, r
      if h
        reactive (liftB numBinaryOps[o], @.beh, h.beh)
      else
        reactive (liftB numBinaryOps[o], @.beh, r)
    right: (o, l) -> reactive (liftB numBinaryOps[o], l, @.beh)

  Proxy.create handler, null, reactiveSecret



stream = (e) ->
  throw "not implemented yet" if not (e instanceof EventStream)
  
  handler = merge (makeIdHandler e),
    evt: e
    get: (r, name) -> wrapGet handler.evt, handler.evt[name]
  
  Proxy.create handler, null, streamSecret


# root.reactive = reactive

oTimerB = timerB
root.timerB = (interval) -> 
  reactive (oTimerB interval)

oInsertValueB = insertValueB
root.insertValueB = (value, dest, field) ->
  rh = Proxy.unProxy reactiveSecret, value
  if rh
    oInsertValueB rh.beh, dest, field
  else
    throw "not implemented"

o$E = $E
root.$E = (el, evt) -> stream (extractEventE el, evt)
