(function() {

  define([], function() {
    var add;
    add = function(x) {
      return x + 10;
    };
    return {
      add: add
    };
  });

}).call(this);