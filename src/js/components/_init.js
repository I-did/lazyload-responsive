let _ = this,
  opt = _.options,
  nodeList = document.querySelectorAll(opt.elements),
  clearRegExp = /\n|\t|\s{2,}/gm,
  widthRegExp = /\(max\-width.*?\)|\(min\-width.*?\)/g,
  insideRegExp = /\{.*?\}/g;

  for (let i = 0; i < nodeList.length; i++) {
    let mediaAttr = nodeList[i].getAttribute(opt.mediaAttr),
      mediaQuiries,
      mediaInsides;

    nodeList[i].lazyObject = {
      src: nodeList[i].getAttribute(opt.srcAttr),
      media: {}
    };

    if (mediaAttr) {
      mediaAttr = mediaAttr.replace(clearRegExp, '');
      mediaQuiries = mediaAttr.match(widthRegExp);
      mediaInsides = mediaAttr.match(insideRegExp);

      let lazyObjMedia = nodeList[i].lazyObject.media;

      lazyObjMedia.length = mediaQuiries.length;

      for (let j = 0; j < lazyObjMedia.length; j++) {
        lazyObjMedia[mediaQuiries[j]] = mediaInsides[j].slice(1, -1);          
      }
    }
    _.elements.push(nodeList[i]);
    let evt = new CustomEvent('lazyinit');
    nodeList[i].dispatchEvent(evt);
  }
_.startObserve();