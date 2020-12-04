lazyload.prototype.createObserver = function() {
  let _ = this;

  _.imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        let element = entry.target,
          lazyDelay = element.getAttribute('data-lazy-delay');

        if (lazyDelay) {
          element.lazyObject.lazyTimer = setTimeout(function() {
            _.setImg(element);
          }, +lazyDelay);
        } else {
          _.setImg(element);
        }
      }
    });
  });
}