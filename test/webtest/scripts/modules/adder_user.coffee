define ["modules/adder_module"], (adder) ->
  {add} = adder

  init: ->
    add "foo"
    # add -1000