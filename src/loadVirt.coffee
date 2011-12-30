# note that this file should not be compiled with virtualization turned on 

window.loadVirt = exports if window?

# only patch Proxy once
exports.patch = ->
  if not Proxy.__vvalues?
    Proxy.__vvalues = true

    # reference to the unpatched proxy create function
    old_create = Proxy.create
    old_createFunction = Proxy.createFunction
    # store of the handler and secret values for each proxy we create
    proxyMap = new WeakMap()

    # patch create by adding the secret param (for unProxy)
    # and storing the secret+handler in the proxyMap
    Proxy.create = (handler, proto, secret) ->
      p = old_create.call this, handler, proto
      proxyMap.set p, [handler, secret]
      p

    Proxy.createFunction = (handler, callTrap, constructTrap, secret) ->
      p = old_createFunction.call this, handler, callTrap, constructTrap
      proxyMap.set p, [handler, secret]
      p
    

    # if secret matches the secret that proxy was created with
    # then return the handler otherwise false
    Proxy.unProxy = (secret, proxy) ->
      # WeakMap.get will throw exception if we don't do this check
      return false if proxy isnt Object(proxy)
      hs = proxyMap.get proxy
      [handler, s] = hs if hs?
      if s and s is secret
        handler
      else
        false

    # return the given trap from the proxy's handler
    valueTrap = (trap, proxy) ->
      [h,] = proxyMap.get proxy, [false, false]
      if h and trap of h
        h[trap].bind h
    
    # if val is a proxy calls the proxy's unary trap
    # otherwise runs the lazyExpr
    Proxy.dispatchUnary = (op, val, lazyExpr) ->
      if Proxy.isProxy val 
        (valueTrap 'unary', val)(op)
      else 
        do lazyExpr

    # if left or right is a proxy calls the proxy's binary trap
    # otherwise runs the lazyExpr
    Proxy.dispatchBinary = (op, left, right, lazyExpr) ->
      if Proxy.isProxy left 
        (valueTrap 'left', left)(op, right)
      else if Proxy.isProxy right 
        (valueTrap 'right', right)(op, left) 
      else 
        do lazyExpr

    # if cond is a proxy calls the proxy's test trap
    # otherwise just return the value of cond
    Proxy.dispatchTest = (cond) ->
      if Proxy.isProxy cond
        do (valueTrap 'test', cond)
      else 
        cond

    Proxy.isProxy = (p) ->
      if p != Object p then false else proxyMap.has p
