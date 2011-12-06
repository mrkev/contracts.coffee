##
# Flapjax core

# Sentinel value returned by updaters to stop propagation.
doNotPropagate = {}

# Pulse: Stamp * Path * Obj
Pulse = (stamp, value) ->
  # Timestamps are used by liftB (and ifE).  Since liftB may receive multiple
  # update signals in the same run of the evaluator, it only propagates the 
  # signal if it has a new stamp.
  @stamp = stamp
  @value = value

# Probably can optimize as we expect increasing insert runs etc
PQ = ->
  ctx = this
  ctx.val = []

  @insert = (kv) ->
    ctx.val.push(kv)
    kvpos = ctx.val.length - 1
    while kvpos > 0 and kv.k < ctx.val[Math.floor((kvpos-1)/2)]?.k
      oldpos = kvpos
      kvpos = Math.floor((kvpos-1)/2)
      ctx.val[oldpos] = ctx.val[kvpos]
      ctx.val[kvpos] = kv

  @isEmpty = ->
    ctx.val.length is 0

  @pop = ->
    if ctx.val.length is 1
      return ctx.val.pop()

    ret = ctx.val.shift()
    ctx.val.unshift(ctx.val.pop())
    kvpos = 0
    kv = ctx.val[0];
    while true
      leftChild = if kvpos*2+1 < ctx.val.length then ctx.val[kvpos*2+1].k else kv.k+1
      rightChild = if kvpos*2+2 < ctx.val.length then ctx.val[kvpos*2+2].k else kv.k+1
      if leftChild > kv.k and rightChild > kv.k
          break

      if leftChild < rightChild
        ctx.val[kvpos] = ctx.val[kvpos*2+1]
        ctx.val[kvpos*2+1] = kv
        kvpos = kvpos*2+1
      else 
        ctx.val[kvpos] = ctx.val[kvpos*2+2]
        ctx.val[kvpos*2+2] = kv
        kvpos = kvpos*2+2
    ret
  @

lastRank = 0
stamp = 1
nextStamp = -> ++stamp


# propagatePulse: Pulse * Array Node -> 
# Send the pulse to each node 
propagatePulse = (pulse, node) ->
  queue = new PQ() #topological queue for current timestep

  queue.insert({k:node.rank,n:node,v:pulse})
  len = 1

  while len 
    qv = queue.pop()
    len--
    nextPulse = qv.n.updater(new Pulse(qv.v.stamp, qv.v.value))
    weaklyHeld = yes

    if nextPulse isnt doNotPropagate
      i = 0
      while i < qv.n.sendsTo.length
        weaklyHeld = weaklyHeld and qv.n.sendsTo[i].weaklyHeld
        len++
        queue.insert({k:qv.n.sendsTo[i].rank,n:qv.n.sendsTo[i],v:nextPulse})
        i++

      qv.n.weaklyHeld = yes if qv.n.sendsTo.length > 0 and weaklyHeld
  undefined

# Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
EventStream = (nodes, updater) ->
  @updater = updater
  
  @sendsTo = [] #forward link
  @weaklyHeld = no

  node.attachListener @ for node in nodes

  @rank = ++lastRank
# todo why did they do this? makes no sense
#EventStream:: = new Object();

# createNode: Array Node a * ( (Pulse b ->) * (Pulse a) -> Void) -> Node b
exports.createNode = createNode = (nodes, updater) ->
  new EventStream nodes, updater

genericAttachListener = (node, dependent) ->
  node.sendsTo.push dependent
  
  if node.rank > dependent.rank
    lowest = lastRank+1
    q = [dependent]
    while q.length
      cur = q.splice(0,1)[0]
      cur.rank = ++lastRank
      q = q.concat cur.sendsTo

genericRemoveListener = (node, dependent, isWeakReference) ->
  foundSending = no
  i = 0
  while i < node.sendsTo.length and not foundSending
    if node.sendsTo[i] is dependent
      node.sendsTo.splice i, 1
      foundSending = yes
    i++

  if  isWeakReference is yes and node.sendsTo.length is 0
    node.weaklyHeld = yes
  
  foundSending

# attachListener: Node * Node -> Void
# flow from node to dependent
# note: does not add flow as counting for rank nor updates parent ranks
EventStream::attachListener = (dependent) ->
  if not dependent instanceof EventStream
    throw 'attachListener: expected an EventStream'
  genericAttachListener @, dependent


# note: does not remove flow as counting for rank nor updates parent ranks
EventStream::removeListener = (dependent, isWeak) ->
  if not dependent instanceof EventStream
    throw 'removeListener: expected an EventStream'

  genericRemoveListener this, dependent, isWeak


sendEvent = (node, value) ->
  if not node instanceof EventStream 
    throw 'sendEvent: expected Event as first arg'
  
  propagatePulse (new Pulse nextStamp(), value), node


# An internalE is a node that simply propagates all pulses it receives.  
# It's used internally by various combinators.
internalE = (dependsOn = []) -> createNode dependsOn, (pulse) -> pulse

zeroE = ->
  createNode [], (pulse) ->
    throw "zeroE : received a value; zeroE should not receive a value; the value was #{pulse.value}"


exports.oneE = oneE = (val) ->
  sent = false
  evt = createNode [], (pulse) ->
    throw 'oneE : received an extra value' if sent
    sent = true
    pulse

  setTimeout (-> sendEvent evt,val), 0
  evt


mergeE = (deps...) ->
  if deps.length is 0
    zeroE()
  else 
    internalE deps

EventStream::mergeE = (deps...) ->
  deps.push @
  internalE deps


EventStream::constantE = (constantValue) ->
  createNode [@], (pulse) ->
    pulse.value = constantValue
    pulse

constantE = (e,v) -> e.constantE v

EventStream::startsWith = (init) -> new Behavior @,init

# bindE :: EventStream a * (a -> EventStream b) -> EventStream b
EventStream::bindE = (k) ->
  # m.sendsTo resultE
  # resultE.sendsTo prevE
  # prevE.sendsTo returnE
  m = this
  prevE = false
  
  outE = createNode [], (pulse) -> pulse
  outE.name = "bind outE"
  
  inE = createNode [m], (pulse) ->
    prevE.removeListener outE, true if  prevE
    prevE = k pulse.value
    if  prevE instanceof EventStream
      prevE.attachListener outE
    else
      throw "bindE : expected EventStream"
    doNotPropagate
  inE.name = "bind inE"
  outE

EventStream::switchE = -> @bindE (v) -> v

# This is up here so we can add things to its prototype that are in flapjax.combinators
exports.Behavior = Behavior = (event, init, updater) ->
  if not event instanceof EventStream
    throw 'Behavior: expected event as second arg';

  behave = this
  @last = init

  # sendEvent to this might impact other nodes that depend on this event
  # sendBehavior defaults to this one
  @underlyingRaw = event
  
  # unexposed, sendEvent to this will only impact dependents of this behaviour
  @underlying = createNode [event], (
    if updater then (p) ->
      behave.last = updater p.value
      p.value = behave.last
      p
    else (p) ->
      behave.last = p.value
      p
  )
  @
# Behavior:: = new Object()

Behavior::valueNow = -> @last
valueNow = (behavior) -> behavior.valueNow()

Behavior::changes = -> this.underlying
changes = (behave) -> behave.changes()

exports.liftB = liftB = (fn, args...) ->
  
  # dependencies
  constituentsE = (args.filter (v) -> v instanceof Behavior).map changes
  
  # calculate new vals
  getCur = (v) -> if v instanceof Behavior then v.last else v
  
  ctx = this
  getRes = -> (getCur fn).apply ctx, (args.map getCur)

  if constituentsE.length is 1
    return new Behavior constituentsE[0], getRes(), getRes
    
  # gen/send vals @ appropriate time
  prevStamp = -1
  mid = createNode constituentsE, (p) ->
    if p.stamp isnt prevStamp
      prevStamp = p.stamp
      p 
    else
      doNotPropagate
  
  new Behavior mid, getRes(), getRes

Behavior::liftB = (args...) -> liftB.apply this, args.concat [@]

# artificially send a pulse to underlying event node of a behaviour
# note: in use, might want to use a receiver node as a proxy or an identity map
Behavior::sendBehavior = (val) -> sendEvent @underlyingRaw, val

sendBehavior = (b,v) -> b.sendBehavior v


exports.receiverE = receiverE = ->
  evt = internalE()
  evt.sendEvent = (value) ->
    propagatePulse new Pulse(nextStamp(), value), evt
  evt


EventStream::mapE = (f) ->
  if not f instanceof Function
    throw 'mapE : expected a function as the first argument; received #{f}'
  
  createNode [this], (pulse) ->
    pulse.value = f pulse.value
    pulse

EventStream::notE = -> @mapE (v) -> not v


EventStream::filterE = (pred) ->
  if not pred instanceof Function
    throw 'filterE : expected predicate; received #{pred}'
  
  # Can be a bindE
  createNode [@], (pulse) ->
    if pred pulse.value then pulse else doNotPropagate


filterE = (e,p) -> e.filterE p


# Fires just once.
EventStream::onceE = ->
  done = no
  # Alternately: this.collectE(0,\n v -> (n+1,v)).filterE(\(n,v) -> n == 1).mapE(fst)
  createNode [@], (pulse) ->
    if not done 
      done = yes 
      pulse
    else 
      doNotPropagate


onceE = (e) -> e.onceE()


EventStream::skipFirstE = ->
  skipped = yes
  createNode [@], (pulse) -> if skipped then pulse else doNotPropagate

skipFirstE = (e) -> e.skipFirstE()


EventStream::collectE = (init, fold) ->
  acc = init
  @mapE (n) ->
    next = fold n, acc
    acc = next
    next


collectE = (e,i,f) -> e.collectE i,f

EventStream::switchE = ->
  @bindE (v) -> v

recE = (fn) ->
  inE = receiverE()
  outE = fn inE
  outE.mapE (x) ->
    inE.sendEvent x
  outE

switchE = (e) -> e.switchE()


EventStream::ifE = (thenE,elseE) ->
  testStamp = -1
  testValue = false
  
  createNode [@], (pulse) ->
    testStamp = pulse.stamp 
    testValue = pulse.value
    doNotPropagate
  
  mergeE(
    createNode([thenE],(pulse) -> send pulse if testValue and (testStamp is pulse.stamp)),
    createNode([elseE],(pulse) -> send pulse if not testValue and (testStamp is pulse.stamp)) 
  )


ifE = (test,thenE,elseE) ->
  if test instanceof EventStream
    test.ifE thenE,elseE
  else
    if test then thenE else elseE


andE = (nodes...) ->
  acc = if nodes.length > 0 then nodes[nodes.length - 1] else oneE(true)
  
  i = nodes.length - 2
  while i > -1 
    acc = ifE(
      nodes[i], 
      acc, 
      nodes[i].constantE(false))
    i--
  acc


EventStream::andE = (others...) ->
  deps = [@].concat others
  andE.apply @, deps


orE = (nodes...) ->
  acc = if nodes.length > 2 then nodes[nodes.length - 1] else oneE(false)

  i = nodes.length -2
  while i > -1
    acc = ifE(
      nodes[i],
      nodes[i],
      acc)
  acc

EventStream::orE = (others...) ->
  deps = [@].concat others
  orE.apply @, deps


delayStaticE = (event, time) ->
  resE = internalE()
  
  createNode [@], (p) ->
    setTimeout (-> sendEvent resE, p.value),  time
    doNotPropagate
  resE

# delayE: Event a * [Behavior] Number ->  Event a
EventStream::delayE = (time) ->
  event = @
  
  if time instanceof Behavior
    receiverEE = internalE()
    link = 
      from: event
      towards: delayStaticE event, valueNow(time)
    
    # TODO: Change semantics such that we are always guaranteed to get an event going out?
    switcherE = createNode(
      [changes time],
      (p) ->
        link.from.removeListener link.towards
        link =
          from: event, 
          towards: delayStaticE event, p.value
        sendEvent receiverEE, link.towards
        doNotPropagate)

    resE = receiverEE.switchE()
    
    sendEvent switcherE, valueNow(time)
    resE
  else 
    delayStaticE event, time

delayE = (sourceE,interval) ->
  sourceE.delayE interval

# mapE: ([Event] (. Array a -> b)) . Array [Event] a -> [Event] b
mapE = (fn, valOrNodes...) ->
  # selectors[i]() returns either the node or real val, optimize real vals
  selectors = []
  selectI = 0
  nodes = []

  i = 0
  while i < valsOrNodes.length
    if valsOrNodes[i] instanceof EventStream
      nodes.push valsOrNodes[i]
      selectors.push ((ii) -> (realArgs) -> realArgs[ii])(selectI)
      selectI++
    else 
      selectors.push ((aa) -> -> aa)(valsOrNodes[i])
    i++
  
  context = @
  nofnodes = selectors.slice 1
  
  if nodes.length is 0
    oneE fn.apply(context, valsOrNodes)
  else if nodes.length is 1 and fn instanceof Function
    nodes[0].mapE (args...)->
        fn.apply(
          context, 
          nofnodes.map (s) -> s args)
  else if nodes.length is 1
    fn.mapE (v) ->
        args = arguments
        v.apply(
          context, 
          nofnodes.map (s) -> s args)
   else if fn instanceof Function
    createTimeSyncNode(nodes).mapE(
      (arr) ->
        fn.apply(
          @,
          nofnodes.map (s) -> s arr))
  else if  fn instanceof EventStream
    createTimeSyncNode(nodes).mapE(
      (arr) ->
        arr[0].apply(
          @, 
          nofnodes.map (s) -> s arr))
  else
    throw 'unknown mapE case'


EventStream::snapshotE = (valueB) ->
  createNode [@], (pulse) ->
    pulse.value = valueNow valueB
    pulse


snapshotE = (triggerE,valueB) ->
  triggerE.snapshotE valueB


___timerID = 0
__getTimerId = -> ++___timerID
timerDisablers = []


disableTimerNode = (node) -> timerDisablers[node.__timerId]()

exports.disableTimer = disableTimer = (v) ->
  if v instanceof Behavior
    disableTimerNode v.underlyingRaw
  else if  v instanceof EventStream
    disableTimerNode v

createTimerNodeStatic = (interval) ->
  primEventE = internalE()
  primEventE.__timerId = __getTimerId()

  listener = (evt) ->
    if not primEventE.weaklyHeld
      sendEvent primEventE, (new Date()).getTime()
    else 
      clearInterval timer
      isListening = false
    true

  timer = setInterval listener, interval
  timerDisablers[primEventE.__timerId] = -> clearInterval(timer)
  primEventE


timerE = (interval) ->
  if interval instanceof Behavior
    receiverE = internalE()
    
    res = receiverE.switchE()
    
    # keep track of previous timer to disable it
    prevE = createTimerNodeStatic valueNow interval
    
    # init
    sendEvent receiverE, prevE
    
    # interval changes: collect old timer
    createNode [changes(interval)], (p) ->
      disableTimerNode prevE
      prevE = createTimerNodeStatic p.value
      sendEvent receiverE, prevE
      doNotPropagate
    
    res.__timerId = __getTimerId()
    timerDisablers[res.__timerId] = ->
      disableTimerNode[prevE]()
      undefined 
    res
  else 
    createTimerNodeStatic interval

exports.startsWith = startsWith = (e,init) ->
  if not e instanceof EventStream
    throw 'startsWith: expected EventStream; received #{e}'
  e.startsWith init



exports.timerB = timerB = (interval) -> startsWith timerE(interval), (new Date()).getTime()

# TODO optionally append to objects
# createConstantB: a -> Behavior a
constantB = (val) -> new Behavior internalE(), val

Behavior::ifB = (trueB,falseB) ->
  testB = @
  # TODO auto conversion for behaviour funcs
  if not trueB instanceof Behavior
    trueB = constantB trueB

  if not falseB instanceof Behavior
    falseB = constantB falseB

  liftB ((te,t,f) -> if te then t else f), testB, trueB, falseB


ifB = (test,cons,altr) ->
  if not test instanceof Behavior 
    test = constantB test

  test.ifB cons, altr
