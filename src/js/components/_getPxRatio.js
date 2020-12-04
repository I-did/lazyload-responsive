lazyload.prototype.getPxRatio = function() {
  let _ = this,
    windowPixelRatio = +window.devicePixelRatio.toFixed(1),
    str,
    num;

  // if (windowPixelRatio <= 1) {
  //   console.log('1x');
  // } else if (windowPixelRatio > 1 && windowPixelRatio <= 2) {
  //   console.log('2x');
  // } else if (windowPixelRatio > 2 && windowPixelRatio <= 3) {
  //   console.log('3x');
  // } else if (windowPixelRatio > 3 && windowPixelRatio <= 4) {
  //   console.log('4x');
  // }

  for (let i = 1; i < 10; i++) {
    if (i === 1) {
      if (windowPixelRatio <= i) {
        str = i + 'x';
        num = i;
        break;
      }
    } else {
      if (windowPixelRatio > i - 1 && windowPixelRatio <= i) {
        str = i + 'x';
        num = i;
        break;
      }
    }
  }

  _.currentPixelRatio.str = str;
  _.currentPixelRatio.num = num;
}