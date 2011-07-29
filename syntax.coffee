id :: (Num) -> Num
id = (x) -> x

id :: (Num) -> Num
id = (x) -> x

or :: (Num or Str) -> Bool
or :: (Num and Str) -> Bool # not a very accepting contract :)

# multi args
adder :: (Num, Str, Bool) -> Str
adder = (a, b, c) ->
  a + b + c


# optional args
opt :: (Num, Str, Str?) -> Str  # question mark already used in CS...
opt = (a, b, c) -> a + b

app :: (((Num) -> Bool), Bool) -> Bool
app = (f, x) -> f x


# flat predicates...want to allow arbitrary expressions
# to define contracts
f :: (  #{ !(x) -> typeof x == "number" }
        #{ !(x) -> typeof x == "string" })
     -> #{ !(x) -> typeof x == "boolean" }
# equivalent to
Num = !(x) -> typeof x == "number"
Str = !(x) -> typeof x == "string"
Bool = !(x) -> typeof x == "boolean"
f :: (Num, Str) -> Bool
# but then what about naming objects contracts?
o = { a: Str, b: Bool }
# for contract naming the names value is treated as such:
# - functions are treated as a predicate and wrapped as a flat contract
# - objects are treated as object contracts...all props must be contracts
# - arrays are treated the same as objects (but for arrays)
# - other values (42, "foo") are errors (could also implicitly wrap as typeof contracts, but I prefer an error)

# dependent
inc :: (Num) -> !(result) -> result > $1
inc = (x) -> x + 1

# possibilities...
callonly :: (Num, Bool) -> Bool {callOnly : true}
callonly :: (Num, Bool) -> Bool [ callOnly : true ]
callonly :: (Num, Bool) -> Bool callOnly: true
callonly :: (Num, Bool, {callOnly: true}) -> Bool # no...conflicts with object contract
callonly :: (Num, Bool) > Bool # the *very* thin arrow :-)
callonly :: (Num, Bool) >> Bool
callonly :: (Num, Bool) --> Bool # think we're going with this one

# for calling with new only
constructor :: (Num, Bool) n-> {a: Str, b: Num}
constructor :: (Num, Bool) => {a: Str, b: Num}
# fat arrow is also used in CS for creating functions with this bound to the current this
# similar ballpark meaning...too close?
constructor :: (Num, Bool) --> {a: Str, b: Num}
constructor :: (Num, Bool) ==> {a: Str, b: Num}

callAndNew :: (Num) --> Bool             # call contract
              (Str) ==> {a: Num, b: Str} # new contract
# or whatever arrows work best...kinda like --> as call only and ==> as new only
# maybe >> or >>> as safe new?
callOnly :: (Num) --> Bool
newOnly  :: (Num) ==> Bool
safeNew  :: (Num) >>> {a: Num, b: Str} # conflicts with shift operator
safeNew  :: (Num) -=> {a: Num, b: Str}

# objects
o =
  a: 42
  b: "foo"
  f: (x) -> x


# external
o :: { a : Num, b: Str, f: ((any) -> any) }
o ::
  a: Num
  b: Str
  f: ((any) -> any)
# and we also have named contracts which looks similar
MyObj = { a: Num, b: Str, f: (any) -> any }

o ::
  a: Num
  b: Num? # optional
  c: Str
  d: {value: Str, writable: false}
  e: Self # or self
  {frozen: true}
# so last property can be an options object for the contract...

o ::
  a: Num
  b: Str
  :: # prototype
    c: Bool
    d: Num
# this says o _must_ have a and b as it's own properties (not
# somewhere on the prototype chain) and c and d can be on the prototype
# using :: in the last slot since cs already uses it to refer to prototype
# in eg String::dasherize = -> this.replace /_/g, "-"

# this contract
o ::
  a : Num,
  b: Str,
  f: (any) -> any {this: {a: Num, b: Str}}
  # or
  f: (any, this: {a: Str, b: Num}) -> any # could conflict with naming in dependent contracts...

# pre/post
o ::
  a : Num,
  b: Str,
  f: (any) -> any {pre: (obj) -> ...}
  # or
  f: (any, pre: (obj) -> ...) -> any


o ::
  f: (pre:Num, Bool, this: {a:Bool}, pre: ((obj) -> ...), post: ((obj) -> ...))
     -> ( pre > res)
# can disambiguate named contract arguments from pre/post/this based on
# position...this/pre/post contracts must come at the end

ar :: (Str, Num, Bool)
ar :: [Str, Num, Bool]
ar = ["foo", 42, false]

fst :: ((Str, Num)) -> Str
fst = (tup) -> tup[0]
# so obvious problem here is the two meanings of parens
# though the meanings are related, at least concepturally...

sort :: ([Num], (Num -> Bool)) -> [Num]

tup :: (Str, Num, ...Bool)
tup :: (...Bool) # immutable...unlike array
arr :: [Str, Num, ...Bool]



# naming contracts
NumId = (Num) -> Num # ambiguous!
NumId ::= (Num) -> Num
NumId = #{ (Num) -> Num }

Obj = {a: Num, b: Num}
Obj ::= {a: Num, b: Num}
Obj = #{ {a: Num, b: Num}

Arr = [Num, Num]
Arr ::= [Num, Num]
Arr = #{ [Num, Num] }
