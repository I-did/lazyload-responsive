lazyload.prototype.createImgLazyObject = function(images) {
  let _ = this,
    opt = _.options,
    nodeList = images || document.querySelectorAll(opt.elements),
    clearRegExp = /\n|\t|\s{2,}/gm,
    widthRegExp = /\(max\-width.*?\)|\(min\-width.*?\)/g,
    insideRegExp = /\{.*?\}/g,
    imageSetRegExps = {
      imgSet: /image-set\((.*?)\)/,
      pxRatio: /[0-9.]+x$/,
      src: /.*(?=\s[0-9.]+x$)/,
      split: /\,\s|\,/
    };

  for (let i = 0; i < nodeList.length; i++) {
    let mediaAttr = nodeList[i].getAttribute(opt.mediaAttr),
      src = nodeList[i].getAttribute(opt.srcAttr),
      clearMediaForEl = nodeList[i].getAttribute('data-lazy-clear-media'),
      clearSrcForEl = nodeList[i].getAttribute('data-lazy-clear-src'),
      mediaQuiries,
      mediaInsides;

    nodeList[i].lazyObject = {
      src: _.imgSrcParse(src, imageSetRegExps),
      media: {},
      lazyTimer: null
    };

    if (mediaAttr) {
      mediaAttr = mediaAttr.replace(clearRegExp, '');
      mediaQuiries = mediaAttr.match(widthRegExp);
      mediaInsides = mediaAttr.match(insideRegExp);

      let lazyObjMedia = nodeList[i].lazyObject.media;

      lazyObjMedia.length = mediaQuiries.length;

      for (let j = 0; j < lazyObjMedia.length; j++) {
        lazyObjMedia[mediaQuiries[j]] = _.imgSrcParse(mediaInsides[j].slice(1, -1), imageSetRegExps);
      }

      if ((opt.clearMedia || clearMediaForEl == 'true') && clearMediaForEl != 'false') {
        nodeList[i].removeAttribute(opt.mediaAttr);
      }
    }

    if ((opt.clearSrc || clearSrcForEl == 'true') && clearSrcForEl != 'false') {
      nodeList[i].removeAttribute(opt.srcAttr);
    }

    _.elements.push(nodeList[i]);

    if (typeof window.CustomEvent === "function") {
      let evt = new CustomEvent('lazyinit');
      nodeList[i].dispatchEvent(evt);
    }
  }
}