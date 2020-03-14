let _ = this,
  opt = _.options,
  nodeList = document.querySelectorAll(opt.elements),
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
      mediaQuiries,
      mediaInsides;

    nodeList[i].lazyObject = {
      src: _.imgSrcParse(src, imageSetRegExps),
      media: {}
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

      if (opt.clearMedia) {
        nodeList[i].removeAttribute('data-media');
      }
    }

    if (opt.clearSrc) {
      nodeList[i].removeAttribute('data-src');
    }

    _.elements.push(nodeList[i]);

    if (typeof window.CustomEvent === "function") {
      let evt = new CustomEvent('lazyinit');
      nodeList[i].dispatchEvent(evt);
    }
  }

_.getPxRatio();
_.startObserve();