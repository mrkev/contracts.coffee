if require?
  {makeIdHandler, merge, numUnaryOps, numBinaryOps} = require './utils'
else
  {makeIdHandler, merge, numUnaryOps, numBinaryOps} = utils

reactiveSecret = {}
streamSecret = {}

root = exports ? this["frp"] = {}

wrapGet = (that, prop) ->
  if prop instanceof Behavior
    reactive prop
  if prop instanceof EventStream
    stream prop
  else if typeof prop is 'function'
    (args...) ->
      i = 0
      params = []
      while i < args.length
        rh = Proxy.unProxy reactiveSecret, args[i]
        sh = Proxy.unProxy streamSecret, args[i]
        if rh
          params[i] = rh.beh
        else if sh
          params[i] = sh.evt
        else 
          params[i] = args[i]
        i++

      r = prop.apply that, params

      if r instanceof Behavior 
        reactive r 
      else if r instanceof EventStream
        stream r
      else 
        r
  else
    prop

reactive = (x) -> 
  if x instanceof Behavior
    b = x
  else
    # convert our normal value to a behavior
    b = startsWith receiverE(), x

  handler = merge (makeIdHandler b),
    beh: b
  
  handler.get = (r, name) -> wrapGet handler.beh, handler.beh[name]

  handler.unary = (o) ->
    reactive (liftB numUnaryOps[o], @.beh)

  handler.left = (o, r) ->
    h = Proxy.unProxy reactiveSecret, r
    if h
      reactive (liftB numBinaryOps[o], @.beh, h.beh)
    else
      reactive (liftB numBinaryOps[o], @.beh, r)
  handler.right = (o, l) ->
    reactive (liftB numBinaryOps[o], l, @.beh)

  p = Proxy.create handler, null, reactiveSecret

  p.set = (n) ->
    h = Proxy.unProxy reactiveSecret, this
    h.beh.sendBehavior n
  p.curr = ->
    h = Proxy.unProxy reactiveSecret, this
    h.beh.valueNow()
  p.if = (tru, fls) ->
    h = Proxy.unProxy reactiveSecret, this
    reactive h.beh.ifB tru, fls
  p.change = (fn) ->
    handler.beh.changes().mapE fn 
    undefined

  p



stream = (e) ->
  throw "not implemented yet" if not (e instanceof EventStream)
  
  handler = merge (makeIdHandler e),
    evt: e

  handler.get = (r, name) -> wrapGet handler.evt, handler.evt[name]
  
  Proxy.create handler, null, streamSecret


root.reactive = reactive

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


root.$E = (el, evt) -> stream (extractEventE el, evt)

# wraping the jquery object to do reactive stuff
root.dom = (sel) ->
  jq = jQuery sel

  text: (value) ->
    jq.text value.curr()
    value.change (v) -> jq.text v

