
# COLOR_LOOKUP =
#   "black": "#ffffff"

# def = "red"

# find_color :: ({nodeName:Str,parentNode:Self?}) -> Str
# find_color = (d) ->
#   COLOR_LOOKUP[d.nodeName] || (def if !d.parentNode)


# o = {nodeName: "foo", parentNode: null}
# o.parentNode = o

# find_color o



# COLOR_LOOKUP =
#     energy   : "#fff869"

# find_color :: ({nodeName:Str, parentNode:Self?}) -> Str
# find_color = (d) ->
#     COLOR_LOOKUP[d.nodeName] || (COLOR_LOOKUP.energy if !d.parentNode)


# Either one should trigger
# find_color("energy")
# find_color("foo")
# find_color(nodeName:"energy",parentNode:null)
# find_color(nodeName:"foo",parentNode:null)


# f :: (String) -> Str
# f = (x) -> x
# f "foo"

f :: ({toString: Any}) -> Str
f = (s) ->
  x = s.toString()
  console.log x
  x

f "str"
