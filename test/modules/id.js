 ((function(cb) {if (typeof(define) === 'function' && define.amd) {require(['contracts'], cb); } else if (typeof(require) === 'function') {cb(require('contracts-js')); } else {cb(window.contracts); } })(function(__contracts) { var Undefined,Null,Num,Bool,Str,Odd,Even,Pos,Nat,Neg,Self,Any,None,__define,__require,__exports;Undefined=__contracts.Undefined;Null=__contracts.Null;Num=__contracts.Num;Bool=__contracts.Bool;Str=__contracts.Str;Odd=__contracts.Odd;Even=__contracts.Even;Pos=__contracts.Pos;Nat=__contracts.Nat;Neg=__contracts.Neg;Self=__contracts.Self;Any=__contracts.Any;None=__contracts.None;if(typeof define==="function"&&define.amd){__define=function(a,b,c){var d,e;if(typeof a!=="string"){d=b}else{d=c}e=function(){var a,b,c=[];for(a=0;a<arguments.length;a++){c[a]=__contracts.use(arguments[a],"#{o.filename}")}b=d.apply(this,c);return __contracts.setExported(b,"#{o.filename}")};if(!Array.isArray(b)){b=e}define(a,b,e)}}else if(typeof require!=="undefined"&&typeof exports!=="undefined"){__exports=__contracts.exports("#{o.filename}",exports);__require=function(a){a=require.apply(this,arguments);return __contracts.use(a,"#{o.filename}")}} (function(define, require, exports) {
  
  exports.id = __contracts.guard(__contracts.fun([Str], Str, {}),function(x) {
    return x;
  });

}).call(this, __define, __require, __exports); }));