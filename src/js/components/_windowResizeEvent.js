lazyload.prototype.windowResizeEvent = function(ctx) {
  let _ = this.ctx || this,
    elements = _.elements;

  _.getPxRatio();

  for (let i = 0; i < elements.length; i++) {
    clearTimeout(elements[i].lazyObject.lazyTimer);
    _.imageObserver.unobserve(elements[i]);
    _.imageObserver.observe(elements[i]);
  }
}