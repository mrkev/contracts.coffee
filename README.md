contracts.coffee
================

Contracts.coffee is an extension to CoffeeScript that adds contracts.

Contracts allow you to write powerful runtime assertions about your code. 
Like types but less painful, like assert but more useful.

    square :: (Num) -> Num
    square = (x) -> x * x

    # throws a run-time error
    square "a string"   

Documentation, usage, and more examples: http://disnetdev.com/contracts.coffee/

Quick start
===========

Install via npm:

    npm install -g contracts.coffee

Use the compiler:

    coffee -c --contracts /path/to/script.coffee

The `--contracts` flag enables contracts in the generated JavaScript.
If you don't want the generated JavaScript to check the contracts (but would
still like to use the contract annotations for documentation) just leave off
the flag. 


Note that contracts.coffee requires some pretty new features of Javascript 
([Proxies](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Proxy) 
in particular) so it currently only works on Firefox 4+ but other JavaScript engines should
be adding support soon.
