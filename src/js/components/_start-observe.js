let _ = this,
  elements = _.elements,
  imageObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      let element = entry.target,
        lazyObject = element.lazyObject,
        currentImage;

      for (let key in lazyObject.media) {
        if (key !== 'length') {
          if (matchMedia(key).matches) {
            currentImage = lazyObject.media[key];
          }
        }
      }
      if (!currentImage) {
        currentImage = lazyObject.src;
      }

      switch(element.tagName.toLowerCase()) {
        case 'img':
        case 'iframe':
        case 'video':
          element.src = currentImage;
          break;
        case 'header':
        case 'section':
        case 'footer':
        case 'main':
        case 'div':
        case 'span':
        case 'button':
        case 'form':
        case 'article':
          element.style.backgroundImage = currentImage;
          break;
      }

      if (typeof window.CustomEvent === "function") {
        let evt = new CustomEvent('lazyloaded');
        element.dispatchEvent(evt);
      }
      
      imageObserver.unobserve(element);
    }
  });
});

for (let i = 0; i < elements.length; i++) {
  imageObserver.observe(elements[i]);
}

window.addEventListener('resize', function() {
  for (let i = 0; i < elements.length; i++) {
    imageObserver.unobserve(elements[i]);
    imageObserver.observe(elements[i]);
  }
});