// args: _
let _ = this.ctx || this,
  elements = _.elements;

_.getPxRatio();

for (let i = 0; i < elements.length; i++) {
  _.imageObserver.unobserve(elements[i]);
  _.imageObserver.observe(elements[i]);
}