# lazyload responsive

Обычный lazyload плагин, поддерживающий медиа-запросы. Может частично заменить picture>source.
Для поддержки в IE и iOS < 12.2 версии нужно подключить полифилл intersectionObserver.
```html
<script defer src="js/lazyload.min.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', function() {
    new lazyload();
  });
</script>
```

Простое использование:
```html
<img src="#" alt="#" class="lazy" data-src="./img/car.1200.png">

<div class="lazy" data-src="url(./img/car.576.png)"></div>
```

Множественные фоны:
```html
<div class="lazy" data-src="url(./img/car.1920.png), linear-gradient(to top, red, black)"></div>
```

Медиа-запросы:
```html
<img src="#" alt="#" class="lazy image"
       data-src="./img/car.1920.png"
       data-media="(max-width: 1200px) {./img/car.1200.png}
                   (max-width: 576px) {./img/car.576.png}">

<div class="lazy car-min"
        data-src="url(./img/car.576.png)"
        data-media="(min-width: 768px) {url(./img/car.1200.png)}
                    (min-width: 1200px) {url(./img/car.1920.png)}"></div>
```

Для retina дисплеев можно передать несколько изображений в image-set(), синтаксис аналогичен srcset:
```html
<img class="lazy" src="#" alt="#"
     data-src="image-set(img/car.576.png 1x, img/car.576.png 2x, img/car.576.png 3x)">

<img class="lazy" src="#" alt="#"
     data-src="image-set(img/car.576.png 1x, img/car.576.png 2x, img/car.576.png 3x)"
     data-media="(min-width: 768px) {image-set(img/car.768.png 1x, img/car.768.png 2x, img/car.768.png 3x)}
                 (min-width: 992px) {image-set(img/car.992.png 1x, img/car.992.png 2x, img/car.992.png 3x)}">

<div class="lazy"
     data-src="image-set(url(img/car.576.png 1x), url(img/car.576.png 2x), url(img/car.576.png 3x))"
```

События:
```javascript
let car = document.querySelector('.lazy.car');

car.addEventListener('lazyinit', function() {
  console.log(event.type);
});

car.addEventListener('lazyloaded', function() {
  console.log(event.type);
});
```

Для поддержки в IE, iOS < 12.2 нужно подключитьполифилл intersectionObserver.
```html
<script defer src="js/intersection-observer.min.js"></script>
<script defer src="js/lazyload.min.js"></script>
```

Для срабатывания событий `lazyinit` и `lazyloaded` в IE нужен полифилл customEvents:
```html
<script defer src="js/custom-events.min.js"></script>
```

Можно очистить `data-src` и `data-media` у всех элементов после инициализации скрипта:
```javascript
new lazyload({
  clearSrc: true,
  clearMedia: true
});
```