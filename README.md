# lazyload responsive
Обычный lazyload плагин, поддерживающий медиа-запросы. Может частично заменить picture>source.
```html
<script defer src="js/lazyload.js"></script>
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
Для поддержки IE нужно подключить полифилл customEvents и полифилл intersectionObserver.
```html
<script defer src="js/intersection-observer.min.js"></script>
<script defer src="js/custom-events.js"></script>
<script defer src="js/lazyload.js"></script>
```

Можно очистить `data-src` и `data-media` у всех элементов после инициализации скрипта:
```javascript
new lazyload({
  clearSrc: true,
  clearMedia: true
});
```