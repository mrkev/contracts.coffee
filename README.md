contracts.coffee
================

contracts.coffee is a dialect of CoffeeScript with contract support.

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

If you are running in the browser then you'll need to load the 
contract library (found in [lib/contracts/contracts.js]())

    <script type="text/javascript" src="contracts.js"></script>

If you are running in node.js then you'll need to install the contracts.js package

    npm install contracts.js

Note that contracts.coffee requires some pretty new features of JavaScript 
([Proxies](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Proxy) 
in particular) so it currently only works on Firefox 4+ and node 0.5.10 (but not 0.6 yet) 
but other JavaScript engines should be adding support soon.
