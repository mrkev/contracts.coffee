Virtual Values in CoffeeScript
==============================

This is an experiment to add virtual values (aka Value Proxies) to CoffeeScript. Virtual values allow you to create powerful extensions to a language without needing to change the compiler. They are an extension of JavaScript [Proxies](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Proxy).

Proxies are a meta-object protocol that allow you to add your own code to intercept and handle operations on objects and functions like property gets and function calls. Virtual values extend the operations Proxies allow you to intercept to include operations on primitives (like `+`, `*`, and if statements).

This means you can easily add language extensions like complex numbers or units of measure.

For more information about the theory behind virtual values see the OOPSLA [paper](http://disnetdev.com/papers/oopsla054-austin.pdf) and [slides](http://disnetdev.com/talks/virtual_values.pdf).

(_Note_: This is a branch in the contracts.coffee project but does not include any support for contracts. It is based directly on upstream CoffeeScript with no changes for contracts.)