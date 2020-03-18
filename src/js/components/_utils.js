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