// args: target
  /*
    target = {
      1x: src/src/img.png,
      2x: src/src/img.png
    }
  */

let _ = this,
  currentImage = '';

if (typeof target === 'string') { // если переданный img строка (путь src), то его и возвращаем
  currentImage = target;
} else {  // если переданный img не строка, а объект, то работаем с px ratio

  let img = target[_.currentPixelRatio.str];

  if (!img) { // Если нет img, подходящего под текущий px ratio, то проверяем подходит ли предыдущий

    for (let i = 1; i < 10; i++) {

      let previousPixelRatio = _.currentPixelRatio.num - i + 'x',
        trialImg = target[previousPixelRatio];

      if (trialImg) {
        img = trialImg;
        break;
      }

    }
  }
  currentImage = img;
}

return currentImage;