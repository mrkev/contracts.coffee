id = (x) -> x

id = (x : Num) : Num -> x
id = (x:Num):Num -> x
id = (x :: Num) :: Num -> x

id :: Num -> Num
id = (x) -> x

adder = (a, b, c) -> a + b + c

adder = (a : Num, b : Str, c : Bool) : Str -> a + b + c
adder = (a :: Num, b :: Str, c :: Bool) :: Str -> a + b + c

adder :: Num -> Str -> Bool -> Str # probably too much of a lie
adder :: Num x Str x Bool -> Str
adder :: (Num, Str, Bool) -> Str
adder :: [Num, Str, Bool] -> Str # too much like array?
adder = (a, b, c) -> a + b + c


opt = (a, b, c) -> a + b

opt :: (Num, Str, Opt(Str)) -> Str
opt = (a :: Num, b :: Str, c :: Opt(Str))::Str -> a + b



app = (f, x) -> f x

app = (f : (Num -> Bool), x : Bool): Bool -> f x
app = (f :: (Num -> Bool), x :: Bool):: Bool -> f x

app :: (Num -> Bool) -> Bool -> Bool
app :: (Num -> Bool) x Bool -> Bool
app :: ((Num -> Bool), Bool) -> Bool
app :: [(Num -> Bool), Bool] -> Bool
app = (f, x) -> f x

f :: ( (x) => typeof x == "number"
       (x) => typeof x == "string"
     )
     -> ((x) => typeof x == "boolean")


inc :: Num -> (res > arg)
inc :: Num -> (:res > :arg)
inc :: Num -> (@res > @arg)
inc :: Num -> ($res > $arg)
inc :: Num -> (%res > %arg) # implicit argument...but what about multiple params
inc :: Num -> (res > x) # figure out name from declaration
inc :: x:Num -> (res > x) # explicity name in the contract
inc = (x) -> x + 1

inc = (x :: Num)::res > x -> x + 1



o =
  a: 42
  b: "foo"
  f: (x) -> x

o =
  a :: Num: 42
  b :: Str: "foo"
  f :: (any -> any): (x) -> x

o =
  a : Num: 42
  b : Str: "foo"
  f : (any -> any): (x) -> x


o :: { a : Num, b: Str, f: (any -> any) }
o :: { a :: Num, b :: Str, f :: (any -> any) }
o ::
  a: Num
  b: Str
  f: (any -> any)
o =
  a: 42
  b: "foo"
  f: (x) -> x
