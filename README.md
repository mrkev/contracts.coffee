Virtual Values in CoffeeScript
==============================

This is an experiment to add virtual values (aka Value Proxies) to CoffeeScript. Virtual values allow you to create powerful extensions to a language without needing to change the compiler. They are an extension of JavaScript [Proxies](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Proxy).

Proxies are a meta-object protocol that allow you to add your own code to intercept and handle operations on objects and functions like property gets and function calls. Virtual values extend the operations Proxies already allow you to intercept to include operations on primitives (like `+`, `*`, and if statements).

This means you can easily add language extensions like [complex numbers](https://github.com/disnet/contracts.coffee/blob/virtual-values/extensions/complex.coffee) or [units of measure](https://github.com/disnet/contracts.coffee/blob/virtual-values/extensions/units.coffee) that weren't possible before.

For more information about the theory behind virtual values see the OOPSLA [paper](http://disnetdev.com/papers/oopsla054-austin.pdf) and [slides](http://disnetdev.com/talks/virtual_values.pdf).

(_Note_: This is a branch in the contracts.coffee project but does not include any support for contracts. It is based directly on upstream CoffeeScript with only virtual value changes.)

Using
=====

First off, virtual values depend on JavaScript proxies so you'll need to be using a JavaScript engine that supports them: either Firefox 4+ or recent versions of V8 (it's in node.js 0.5.8+ but not yet in Chrome).

Virtual value support is enable in the CoffeeScript compiler by enabling the `--virtualize` flag:

    coffee -c --virtualize foo.coffee

This creates `foo.js` with support for virtual values.

How it works
============

The global `Proxy` object is [patched](https://github.com/disnet/contracts.coffee/blob/virtual-values/src/loadVirt.coffee) to include support for calling primitive traps. Then the CoffeeScript compiler substitutes calls to the traps instead of the standard primitive operations. For example:

    not x
    y + 42
    if z
      42

Becomes

    Proxy.dispatchUnary('!', x, (-> not x))
    Proxy.dispatchBinary('+', y, 42, (-> y + 42))
    if Proxy.dispatchTest(z)
      42

The dispatch* functions all check to see if their arguments are proxies and if so delegate to the appropriate traps defined on the proxy's handler otherwise they defer to the standard operation (e.g. `(-> not x)`, the function is used to lazily execute the operation only if it actually is needed).

When creating an extension there are four new trap in addition to the traps supported by Proxies: 

  * `unary` for handling unary operations
  * `left` for handling binary operations where the left operand is a proxy
  * `right` for handling binary operations where the right operand is a proxy
  * `test` for handling `if` statements where the conditional is a proxy

If both operands of a binary operation are proxies then `left` is trapped.

So, if you wanted to make a simple virtual number that behaved just like normal numbers but also logged each addition and multiplication you could define one like this:

    makeLoggingNumber = (n) ->
      handler = 
        value: n           # store the original number in the handler for later use
        unary: (op)        -> unaryOps[op] @.value
        left:  (op, right) -> binaryOps[op] @.value, right
        right: (op, left)  -> binaryOps[op] right, @.value
      Proxy.create handler, null, {}

    unaryOps =
      '-': (v) ->
        console.log "Negating: #{v}"
        -v

    binaryOps =
      '+': (a, b) ->
        console.log "Adding: #{a} and #{b}"
        a + b
      '-': (a, b) ->
        console.log "Subtracting: #{a} and #{b}"
        a - b
      '*': (a, b) ->
        console.log "Multiplying: #{a} and #{b}"
        a * b
      '/': (a, b) ->
        console.log "Dividing: #{a} and #{b}"
        a / b

Now to create a logging number:

    log42 = makeLoggingNumber 42
    log42 + 24  # prints out "Adding 42 and 24"

For more interesting and useful examples of how extensions can be written see the [complex number](https://github.com/disnet/contracts.coffee/blob/virtual-values/extensions/complex.coffee) and [units of measure](https://github.com/disnet/contracts.coffee/blob/virtual-values/extensions/units.coffee) extensions. See the [tests](https://github.com/disnet/contracts.coffee/blob/virtual-values/test/virtualize/virtualValues.coffee) for how they are used. 
