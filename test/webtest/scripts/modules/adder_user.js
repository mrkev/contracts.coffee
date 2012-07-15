(function() {

  define(["modules/adder_module"], function(adder) {
    var add;
    add = adder.add;
    return {
      init: function() {
        return add("foo");
      }
    };
  });

}).call(this);