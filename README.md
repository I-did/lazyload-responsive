# lazyload responsive
```html
<script src="../src/js/lazyload-responsive.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', function(){
    new lazyload();
  });
</script>
```
Режимы загрузки:
```javascript
new lazyload({
  mode: 'observe' // by default; || progressive || embed
});
```
Простое использование:
```html
<img src="../src/img/flower.jpg" alt="flower" class="flower-img lazy">

<div class="car-img lazy"
     data-src="../src/img/bmw.png"></div>
```
Фоны:
```html
<div class="car-img lazy"
     data-src="../src/img/bmw.png"></div>

<div class="car-img lazy"
     data-src="url(../src/img/bmw.png),
               url(../src/img/bmw-logo.png),
               linear-gradient(to bottom, black 0 33.333%, red 33.333% 66.666%, gold 66.666%)"></div>
```
Медиа-запросы:
```html
<img src="#" alt="flower" class="flower-img lazy"
     data-src="../src/img/flower.jpg"
     data-media="(max-width: 768px) {../src/img/flower.992.jpg};
                 (max-width: 576px) {#}">

<div class="car-img lazy"
     data-src="url(../src/img/smart.png)"
     data-media="(max-width: 1200px) {url(../src/img/mercedes.png)};
                 (max-width: 768px) {url(../src/img/bmw.png)};
                 (max-width: 576px) {url(../src/img/bmw-moto.png)}"></div>
```
Контент:
```html
<div class="map lazy" src="yandex.map></div>"
```