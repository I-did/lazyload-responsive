lazyload.prototype.setImg = function(element) { // устанавливаем img в зависимости от медиа-запроса и px ratio
  /*
    target = {
      1x: src/src/img.png,
      2x: src/src/img.png
    }
  */

  let _ = this,
    src = element.lazyObject.src,
    media = element.lazyObject.media,
    currentImage = '',
    currentMediaQuery;

  for (let key in media) { // перебираем все data-media, получаем текущий медиа-запрос
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

  if (typeof obj === 'string') { // если переданный img строка (путь src), то его и возвращаем
    currentImage = obj;
  } else { // если переданный img не строка, а объект, то работаем с px ratio

    let img = obj[_.currentPixelRatio.str];

    if (!img) { // Если нет img, подходящего под текущий px ratio, то проверяем подходит ли предыдущий

      for (let i = 1; i < 10; i++) {

        let previousPixelRatio = _.currentPixelRatio.num - i + 'x',
          trialImg = obj[previousPixelRatio];

        if (trialImg) {
          img = trialImg;
          break;
        }

      }
    }
    currentImage = img;
  }

  switch (element.tagName.toLowerCase()) { // проверяем на тэги и подставляем img в src или style
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

  element.classList.add('lazyloaded');

  if (typeof window.CustomEvent === "function") {
    let evt = new CustomEvent('lazyloaded');
    element.dispatchEvent(evt);
  }

  _.imageObserver.unobserve(element);
}