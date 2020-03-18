// args: imageSrc, regExps (imgSet, pxRatio, src, split)
let _ = this;

if (imageSrc.search('image-set') !== -1) {
  let src = {},
    imagesString = imageSrc.replace(regExps.imgSet, '$1'),
    imagesArray = imagesString.split(regExps.split);

    for (let j = 0; j < imagesArray.length; j++) {
      let pixelRatio = imagesArray[j].match(regExps.pxRatio)[0],
        imageSrc = imagesArray[j].match(regExps.src)[0];

      src[pixelRatio] = imageSrc;
    }
    return src;


} else {
  return imageSrc;
}