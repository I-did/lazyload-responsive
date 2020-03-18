// args: images
let _ = this,
  elements = images || _.elements;

for (let i = 0; i < elements.length; i++) {
  _.imageObserver.observe(elements[i]);
}