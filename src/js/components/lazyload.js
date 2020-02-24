;(function(factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.lazyload = factory();
  }
})(function() {
  
  lazyload = (function() {
    //=include _utils.js
  })();

  lazyload.prototype.init = function() {
    //=include _init.js
  };

  lazyload.prototype.startObserve = function() {
    //=include _start-observe.js
  };

  return lazyload;
});