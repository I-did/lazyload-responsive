let _ = this;

_.imageObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      let element = entry.target,
        {src, media} = element.lazyObject,
        currentImage,
        currentMediaQuery;

      for (let key in media) {  // перебираем все data-media, получаем текущий медиа-запрос
        if (key !== 'length') {
          if (matchMedia(key).matches) {
            currentMediaQuery = key;
          }
        }
      }

      // если попали в медиа-запрос, то в агрументе передаем data-media
      // если не сработал ни один медиа-запрос, значит работаем с data-src
        /*
          obj = {
            1px: src/src/img.png,
            2px: src/src/img.png
          }
        */

      let obj = (currentMediaQuery) ? media[currentMediaQuery] : (!currentImage) ? src : '';

      currentImage = _.setImg(obj);

      switch(element.tagName.toLowerCase()) { // проверяем на тэги и подставляем img в src или style
        case 'img':
        // case 'iframe':
        // case 'video':
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
      
      _.imageObserver.unobserve(element);
    }
  });
});