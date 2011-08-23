---
layout: default
---

Contracts.coffee is an experimental fork of CoffeeScript that adds
contracts to the language.

Contracts let you to clearly (even beautifully) express how your code
must and will behave and frees you from writing tons of defensive
boilerplate code. You can think of contracts a little like `assert`
statements on steroids.

Basics
------

Here's a simple example of a contract on a function:

{% highlight coffeescript %}
id :: (Num) -> Num
id = (x) -> x
{% endhighlight %}

This says that the `id` function should always be called with a `number`
and will always return a `number`. It looks a lot like types (in fact
the syntax looks a *lot* like haskell) but this is completely enforced
at runtime in pure JavaScript.

If we attempt to use `id` incorrectly: 

{% highlight coffeescript %}
id "foo"
{% endhighlight %}

The program will halt and display lots of nice information informing us
what we did wrong:

<pre style="color: red">
Error: Contract violation: expected &lt;Number&gt;,
actual: "foo"
Value guarded in: id_module.js:42 -- blame is
on: client_code.js:104
Parent contracts:
(Number) -> Number 
</pre>

You can also put contracts on objects.

{% highlight coffeescript %}
person ::
    name: Str
    age: Num
person =
    name: "Bertrand Meyer"
    age: 42
{% endhighlight %}

And arrays.

{% highlight coffeescript %}
loc :: [...Num]
loc = [99332, 23452, 123, 2, 5000]
{% endhighlight %}

And various combinations thereof.

{% highlight coffeescript %}
average :: ({name: Str, age: Num}, [...Num]) -> Str
average = (person, loc) ->
    sum = loc.reduce (s1, s2) -> s1 + s2
    "#{person.name} wrote on average 
     #{sum / loc.length} lines of code."
{% endhighlight %}

Under the covers contracts are really just normal functions that
return true or false so it's really easy to roll your own.

{% highlight coffeescript %}
addEvens :: (!(x) -> x % 2 is 0) ->
    !(x) -> typeof x is 'number'
addEvens = (x) -> x + 1
{% endhighlight %}

In fact, since contracts are checked at runtime, they can enforce
properties that static type systems can only dream of.

{% highlight coffeescript %}
f :: (!(x) -> isPrime x) -> !(x) -> isPrime x
f = (x) -> x
{% endhighlight %}

Eat your heart out Haskell :)

Quick Start
-----------

Here's what you need to actually start working with contracts.coffee.

First, grab the source from github.

{% highlight bash %}
git clone git://github.com/disnet/contracts.coffee.git
cd contracts.coffee
git submodule init
git submodule update
{% endhighlight %}

Install [Node.js](https://github.com/joyent/node/wiki/Installation)
and then contracts.coffee.

{% highlight bash %}
sudo bin/cake install
{% endhighlight %}

Now, compile some coffee with contracts!

{% highlight bash %}
coffee -cC MyContractedScript.coffee
{% endhighlight %}

Note the `-cC` flag. The `-c` says to compile to JavaScript and `-C`
enables contracts in the compiled JavaScript. If you don't want
contracts enabled (say in production) simply don't include the `-C`
flag.

You will also need to include `loadContracts.js`, which is found in the
root of contracts.coffee. So the header of your HTML file will look
something like:

{% highlight html %}
...
<script src="loadContracts.js"
    type="application/javascript"></script>
<script src="MyContractedScript.js"
    type="application/javascript"></script>
...
{% endhighlight %}

Note that if you have an existing install of CoffeeScript,
installing contracts.coffee will replace it. If you don't want to give
up the old CoffeeScript compiler you can just run contracts.coffee
from its own directory:

{% highlight bash %}
bin/coffee -cC MyContractedScript.coffee
{% endhighlight %}

And finally, note that contracts.coffee requires some pretty new
features of JavaScript to get its job done (in particular
[Proxies](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Proxy))
so it currently only works on Firefox 4+. Support for other JavaScript
engines is coming soon.

This means that if you attempt to run your contracted CoffeeScript
under node/V8:

{% highlight bash %}
# note the -c flag is missing
coffee -C MyContractedScript.coffee
# Compile error!!!
{% endhighlight %}

You will get a bunch of errors. So just compile to JavaScript and run
it in Firefox for now.

A word on modules
-----------------

In order to provide good error messages when things go wrong,
contracts.coffee attempts to enforce a kind of module separation in
your code. To see what this means, consider this simple example:

{% highlight coffeescript linenos %}
# IdServer.coffee
window.id :: (Num) -> Num
window.id = (x) -> x
{% endhighlight %}

{% highlight coffeescript linenos %}
# IdClient.coffee
id = window.id.use()

x = id 42
x + 1     # 43
id "foo"  # error on value guarded in IdServer:3 --
          # blame is on IdClient:2
{% endhighlight %}

When we apply a contract to a value, it is first wrapped up in an
object that has a single `use` method that must be called before the
value can be used. Calling `use` lets the contract library set up
useful information to help track down the problem when a contract is
violated such as which module provided the contracted
value and which module was to blame for the failure.

In this example the error message tells us where the value was first
guarded (IdServer:3) and where is was first "imported" into the client
(IdClient:2). In addition the error that gets thrown has a stacktrace
that can be inspected to show exactly where the violation occurred
(IdClient:6). 

In general it is considered best practice to only put contracts on
modules boundaries but if you want to use them in the same module
simply call `use` immediately:

{% highlight coffeescript linenos %}
id :: (Num) -> Num
id = (x) -> x
id = id.use()

id "foo"
{% endhighlight %}

Functions
---------

Basic functions:

{% highlight coffeescript %}
f :: (Num) -> Num
f = (x) -> x
{% endhighlight %}

Multiple arguments:

{% highlight coffeescript %}
f :: (Num, Str, Bool) -> Num
f = (n, s, b) -> # ...
{% endhighlight %}

Optional arguments:

{% highlight coffeescript %}
f :: (Num, Str, Bool?) -> Num
f = (n, s, b) -> # ...
{% endhighlight %}

All optional arguments must come at the end of the arguments list.

Higher order functions:

{% highlight coffeescript %}
f :: ((Num) -> Bool, Num) -> Bool
f = (g, n) -> # ...
{% endhighlight %}

Functions that *cannot* be called with the `new` keyword:

{% highlight coffeescript %}
f :: (Num) --> Num
f = (n) -> # ...
#...

g = f 42      # ok
g = new f 42  # error!
{% endhighlight %}

Functions that can *only* be called with the `new` keyword:

{% highlight coffeescript %}
f :: (Num) ==> Num
f = (n) -> # ...
#...

g = f 42      # error!
g = new f 42  # ok
{% endhighlight %}

Functions that get `new` inserted automatically if it was left out.

{% highlight coffeescript %}
f :: (Num) -=> Num
f = (n) -> # ...
#...

g = f 42      # ok: converted to g = new f 42
g = new f 42  # ok
{% endhighlight %}

Dependent functions:

{% highlight coffeescript %}
inc :: (Num) -> !(result) -> result > $1
inc = (n) -> n + 1
{% endhighlight %}

The variable `$1` is the first argument passed to the function (`$2`
would be the second argument, `$3` the third, and so on). This allows
us to compare the result of the function to its arguments. Note that
the test is run after the function has completed so if any of the
arguments were mutated during the function's execution the test could
give spurious results.

This contract:

{% highlight coffeescript %}
f :: (Str, @{name: Str}) -> Str
f = (s) -> #...

o = { name: "foo", f: f}
o.f()
{% endhighlight %}

Checks that `this` matches the given object contract.

Objects
-------

Simple properties:

{% highlight coffeescript %}
o ::
  a: Str
  b: Num
  f: (Num) -> Num
o =
  a: "foo"
  b: 42
  f: (x) -> x
{% endhighlight %}

Optional properties:

{% highlight coffeescript %}
o ::
  a: Str
  b: Num?
  f: (Num) -> Num
o =
  a: "foo"
  f: (x) -> x
{% endhighlight %}

Nested objects:

{% highlight coffeescript %}
o ::
  oo: { a: Str }
  b: Num
o =
  oo: { a: "foo" }
  b: 42
{% endhighlight %}

Recursive objects:

{% highlight coffeescript %}
o ::
  a: Num
  b: Self
  c: (Num) -> Self
o = #...
{% endhighlight %}

Objects with functions that have pre and post conditions:

{% highlight coffeescript %}
o ::
  a: Num
  f: (Num) -> Num |
      pre: (o) -> o.a > 10
      post: (o) -> o.a > 20
o =
  a: 12
  f: (x) -> @.a = @.a + x
{% endhighlight %}

The pre and post condition functions are called with the object that
`f` is a member of. As their names imply, `pre` is called before the
function `f` is invoked and `post` is called after.

Object invariants:

{% highlight coffeescript %}
o ::
  a: Num
  f: (Num) -> Num |
      pre: (o) -> o.a > 10
      post: (o) -> o.a > 20
  | invariant: ->
    @.a > 0 and @.a < 100
o =
  a: 12
  f: (x) -> @.a = @.a + x
{% endhighlight %}

The invariant is checked whenever there is a possibility of `o`
mutating (on property sets, delete, etc.).

Arrays
------

Basic arrays:

{% highlight coffeescript %}
a :: [Num, Str, [Bool, Num]]
a = [42, "foo", [true, 24]
{% endhighlight %}

This says the array must have three elements, the first being a `Num`,
the second being a `Str`, and the third being another array.

Multiple elements:

{% highlight coffeescript %}
a :: [...Num]
a = [42, 24, 432, 854, 21]
{% endhighlight %}

The `...` operator says that the array will only contain `Num`s.

Mixing arrays

{% highlight coffeescript %}
a :: [Bool, Str, ...Num]
a = [false, "foo", 432, 854, 21]
{% endhighlight %}

The `...` operator can be mixed with single contracts. This says that
the array's first and second positions must abide by the first two
contracts and the remaining array positions must abide by `Num`. The
`...` operator must be in the last position of the array contract.

And/Or
------

The `or` contract:

{% highlight coffeescript %}
o :: { a: Num or Str }
o = { a: 42 }
{% endhighlight %}

The a property must abide by the `Num` or the `Str` contract. Note
that since higher-order contracts like function and object have
deferred checking they cannot be use with the `or` contract. Or to be
more precise only *one* higher-order contract can be used with
`or`. So you could have `Num or (Num) -> Num` but not
`((Num) -> Num) or ((Str) -> Str)`. If you combine first-order and
higher-order contracts with `or` all the first-order contracts will be
checked and then the higher-order contract will be applied.

The `and` contract:

{% highlight coffeescript %}
o :: { a: Num and Even }
o = { a: 42 }
{% endhighlight %}

The `a` property must abide by both the `Num` and `Even`
contracts. Just like `or` you cannot use multiple higher-order
contracts with `and`.


Naming your own contracts
-------------------------

You can bind a contract to a variable just like normal expressions:

{% highlight coffeescript %}
NumId = ?(Num) -> Num

f :: NumId
f = (x) -> x
{% endhighlight %}

The `?` operator allows you to escape out of the normal expression
language and into the contract language.

You can also escape from the contract language to the normal
expression language:

{% highlight coffeescript %}
takesEvens :: (!(x) -> x % 2 is 0) -> Num
takesEvens = (x) -> x
{% endhighlight %}

The result of the expression in the `!` escape must be a function that
returns a boolean. It is converted to a contract the checks its value
against the provided predicate.

The standard `Num` and `Str` contracts you have seen are
implemented as:

{% highlight coffeescript %}
Num = ?!(x) -> typeof x is 'number'
Str = ?!(x) -> typeof x is 'string'
{% endhighlight %}

The syntax is a little kludgy by it can be read as "assign to Num the
contract that is generated when we convert the predicate `(x) -> ...` to
a contract". 

It could also be written:

{% highlight coffeescript %}
Num = (x) -> typeof x is 'number'
Str = (x) -> typeof x is 'string'

f = (!Num) -> !Str
{% endhighlight %}

But now we must prefix `Num` and `Str` with `!` to convert the expression
to a contract.

<!-- {% highlight coffeescript %} -->
<!-- BST = ?(Null or { -->
<!--     node: Num -->
<!--     left: (Self or Null) -->
<!--     right: (Self or Null) -->
<!--     |
<!--         (@.left is null or @.node > @.left.node) and -->
<!--         (@.right is null or @.node < @.right.node) -->
<!--     }) -->
<!-- {% endhighlight %} -->


  <!-- square :: (Num) -> Num  -->
  <!-- square = (x) -> x * x  -->

  <!-- # Objects: -->
  <!-- person :: -->
  <!--   name: Str  -->
  <!--   age: Num  -->
  <!-- person = -->
  <!--   name: "Bob Smith" -->
  <!--   age: 42 -->

  <!-- # Arrays: -->
  <!-- scores :: [...Num] -->
  <!-- scores = [98, 80, 97, 70, 100] -->

  <!-- # Combined: -->
  <!-- person :: -->
  <!--   name: Str  -->
  <!--   age: Num  -->
  <!--   scores: [...Num] -->
  <!--   grade: (@{scores: [...Num]}) - Num | -->
  <!--          pre: (obj) -> obj.scores.length > 0  -->
  <!--   | invariant: -> @.scores.every (s) - s > 0 && s < 100  -->
  <!-- person =  -->
  <!--   name: "Bob Smith" -->
  <!--   age: 42 -->
  <!--   scores: [98, 80, 97, 70, 100] -->
  <!--   grade = ->   -->
  <!--     @.scores.reduce((s1, s2) - s1 + s2) / @.scores.length -->
