# lazyload responsive

- [Использование](#img)
- [Использование для background, множественные фоны](#bg)
- [Использование с медиа-запросами](#media)
- [Использование для псевдоэлементов ::after или ::before](#after-before)
- [Настройка для retina](#retina)
- [Методы](#methods)
- [События](#events)
- [Поддержка браузерами](#browsers)
- [Все настройки класса и data-attributes](#other)

Обычный lazyload скрипт, поддерживающий медиа-запросы. Может частично заменить picture>source.
Использует [intersectionObserver](https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API).
Работает как для обычных img, так и для фонов div. Поддерживает множественные фоны, поэтому для фона нужно оборачивать путь в `url()`.
После вставки изображения, элементу добавляться класс `lazyloaded`.

Подключение:
```html
<script defer src="js/lazyload.min.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', function() {
    new lazyload();
    // Если контент подгружается динамически,
    // то нужно взять lazyload в переменную и потом вызывать метод refresh()
    let lazy = new lazyload();
  });
</script>
```

## Простое использование
<span id="img"></span>
Нужно установить для элемента класс `lazy` и атрибут `data-src`, который будет содержать путь до изображения.
```html
<div class="lazy" data-src="url(./img/car.576.png)"></div>
```
Для установки изображения в фон, нужно обязательно обернуть фон в `url()`.
```html
<div class="lazy" data-src="url(./img/car.576.png)"></div>
<!-- Также может работать с main, footer, header, section, atricle span, button, form -->
```

## Использование для background, множественные фоны
<span id="bg"></span>
Чтобы установить несколько фонов, нужно перечислять их через запятую, обязательно оборачивая путь `url()`.
```html
<div class="lazy" data-src="url(./img/car.1920.png), linear-gradient(to top, red, black)"></div>
```

## Использование с медиа-запросами
<span id="media"></span>
Тело каждого меди-запроса должно находиться в фигурных скобках `{}`. `(max-width)` должны следовать в порядке убывания, а `(min-width)` в порядке возрастания ширины экрана.
```html
<img src="" alt="" class="lazy image"
       data-src="./img/car.1920.png"
       data-media="(max-width: 1200px) {./img/car.1200.png}
                   (max-width: 576px) {./img/car.576.png}">

<div class="lazy car-min"
        data-src="url(./img/car.576.png)"
        data-media="(min-width: 768px) {url(./img/car.1200.png)}
                    (min-width: 1200px) {url(./img/car.1920.png)}"></div>
```

## Использование для псевдоэлементов ::after или ::before
<span id="after-before"></span>
Использование для псевдоэлементов сводится к изменению стилей в зависимости от класса родителя с lazyload, например, установка иконки телефона:
```html
<a href="tel:81112223344" class="tel lazy" data-src="null">+7(111)222-33-44</a>
```
```css
.tel {
  display: flex;
  font-size: 16px;
}
.tel::before {
  content: '';
  margin: 0 10px 0 0;
  width: 15px;
  height: 10px;
  bacgkround: center/contain no-repeat;
}
.tel.lazyloaded::after {
  background-image: url('../img/icon-tel.svg');
}
```
Таким образом, когда ссылка телефона появится в области просмотра браузера, ей добавится класс `lazyloaded` и для псевдоэлемента `::before` будет задано фоновое изображение.

## Настройка для retina
<span id="retina"></span>
Для retina дисплеев можно передать несколько изображений в image-set(), синтаксис аналогичен srcset:
```html
<img class="lazy" src="" alt=""
     data-src="image-set(img/car.576.png 1x, img/car.576.png 2x, img/car.576.png 3x)">

<img class="lazy" src="" alt=""
     data-src="image-set(img/car.576.png 1x, img/car.576.png 2x, img/car.576.png 3x)"
     data-media="(min-width: 768px) {image-set(img/car.768.png 1x, img/car.768.png 2x, img/car.768.png 3x)}
                 (min-width: 992px) {image-set(img/car.992.png 1x, img/car.992.png 2x, img/car.992.png 3x)}">

<div class="lazy"
     data-src="image-set(url(img/car.576.png 1x), url(img/car.576.png 2x), url(img/car.576.png 3x))"
```

## Методы
<span id="methods"></span>
```javascript
let lazy = new lazyload();

// Если изображения добавляются на сайт динамически, то можно обновить lazyload:
lazy.refresh(); // Ищет элементы с классом .lazy (за которыми еще не установлено наблюдение) и устанавливает наблюдение

// Можно отключить lazyload
lazy.destroy();
```

## События
<span id="events"></span>
```javascript
let car = document.querySelector('.car.lazy');

car.addEventListener('lazyinit', function() {
  console.log(event.type);
});

car.addEventListener('lazyloaded', function() {
  console.log(event.type);
});
```
## Поддержка браузерами
<span id="browsers"></span>
Edge 16+
Firefox 55+,
Chrome 58+
Opera 45+
iOS, Safari 12.2+

Для поддержки IE и более старых версий вышеперечисленных браузеров, нужно подключить  [intersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).
```html
<script defer src="js/intersection-observer.min.js"></script>
<script defer src="js/lazyload.min.js"></script>
```

Для срабатывания событий `lazyinit` и `lazyloaded` в IE нужен полифилл [customEvents](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill):
```html
<script defer src="js/custom-events.min.js"></script>
```

## Все настройки
<span id="other"></span>
Указаны default значения.
```javascript
new lazyload({
  clearSrc: false, // очистить или нет data-src после инициализации скрипта
  clearMedia: false, // очистить или нет data-media после инициализации скрипта
  srcAttr: 'data-src',
  mediaAttr: 'data-media'
});
```
Скрипт поддерживает атрибут `data-lazy-delay="2000"` для откладывания загрузки еще на дополнительное время, например, на 2 секунды.
Скрипт поддерживает атрибуты `data-lazy-clear-src` и `data-lazy-clear-media`, которые могут принимать значения `true` или `false`, и регулируют удалять или нет соответствующий атрибут индивидуально для каждого элмента.