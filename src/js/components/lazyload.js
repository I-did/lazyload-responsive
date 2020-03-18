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

    // _.createImgLazyObject(); -> _.imgSrcParse();
    // _.getPxRatio();
    // _.createObserver();
    // _.startObserve();
    // _.windowResizeEvent();
  };

  lazyload.prototype.createImgLazyObject = function(images) {
    //=include _createImgLazyObject.js
  };

  lazyload.prototype.imgSrcParse = function(imageSrc, regExps) {
    //=include _imgSrcParse.js
  };

  lazyload.prototype.getPxRatio = function() {
    //=include _getPxRatio.js
  };

  lazyload.prototype.createObserver = function() {
    //=include _createObserver.js

    // _.setImg();
  };

  lazyload.prototype.startObserve = function(images) {
    //=include _startObserve.js
  };

  lazyload.prototype.setImg = function(target) {  // устанавливаем img в зависимости от медиа-запроса и px ratio
    //=include _setImg.js
  };

  lazyload.prototype.windowResizeEvent = function(ctx) {
    //=include _windowResizeEvent.js
  };

  lazyload.prototype.destroy = function() {  // удаление lazy
    //=include _destroy.js
  };

  lazyload.prototype.refresh = function() {  // обновление lazy
    //=include _refresh.js

    // _.createImgLazyObject(); -> _.imgSrcParse();
    // _.windowResizeEvent();
  };


  return lazyload;
});