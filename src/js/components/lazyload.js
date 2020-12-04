;
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.lazyload = factory();
  }
})(function() {

  lazyload = (function() {
    function lazy(options) {
      let _ = this;
      _.options = options || {};

      _.defaults = {
        elements: '.lazy',
        srcAttr: 'data-src',
        mediaAttr: 'data-media',
        clearSrc: false,
        clearMedia: false
      };

      _.elements = [];
      _.currentPixelRatio = {};
      _.imageObserver = null;
      _.resizeHandler = {
        handleEvent: _.windowResizeEvent,
        ctx: _
      };

      for (let key in _.defaults) {
        if (_.options[key] === undefined) {
          _.options[key] = _.defaults[key];
        }
      }

      _.init();
    }

    return lazy;
  })();

  //=include _init.js
  
  //=include _createImgLazyObject.js

  //=include _imgSrcParse.js

  //=include _getPxRatio.js

  //=include _createObserver.js

  //=include _startObserve.js

  //=include _setImg.js

  //=include _windowResizeEvent.js

  //=include _destroy.js

  //=include _refresh.js

  return lazyload;
});