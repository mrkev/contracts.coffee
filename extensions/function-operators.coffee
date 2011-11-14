secret = {}

exports.deffun = deffun = (f) ->
  h =
    f: f
    get: (r, name) -> f[name]
    left: (o, r) ->
      if o is '+'
        deffun (args...) ->
          f (r.apply @, args)
  call = (args...) ->
    f.apply @, args

  Proxy.createFunction h, call, call