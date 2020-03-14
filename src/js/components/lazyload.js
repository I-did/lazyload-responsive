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

  lazyload.prototype.imgSrcParse = function(imageSrc, regExps) {
    //=include _imgSrcParse.js
  };

  lazyload.prototype.getPxRatio = function() {
    //=include _getPxRatio.js
  };

  lazyload.prototype.startObserve = function() {
    //=include _startObserve.js
  };

  lazyload.prototype.setImg = function(target) {  // устанавливаем img в зависимости от медиа-запроса и px ratio
    //=include _setImg.js
  };


  return lazyload;
});