;(function(factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.lazyload = factory();
  }
})(function() {

    lazyload = (function() {
    function lazy(options) {
      let _ = this;
      _.options = options || {};

          _.defaults = {
        elements: '.lazy',
        srcAttr: 'data-src',
        mediaAttr: 'data-media'
      };

          _.elements = [];

          for (let key in _.defaults) {
        if (_.options[key] === undefined) {
          _.options[key] = _.defaults[key];
        }
      }

          _.init();
    }

        return lazy;
  })();

  lazyload.prototype.init = function() {
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
  };

  lazyload.prototype.startObserve = function() {
    let _ = this,
      elements = _.elements,
      imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let element = entry.target,
            lazyObject = element.lazyObject,
            currentImage;

              for (let key in lazyObject.media) {
            if (key !== 'length') {
              if (matchMedia(key).matches) {
                currentImage = lazyObject.media[key];
              }
            }
          }
          if (!currentImage) {
            currentImage = lazyObject.src;
          }

              switch(element.tagName.toLowerCase()) {
            case 'img':
            case 'iframe':
            case 'video':
              element.src = currentImage;
              break;
            case 'header':
            case 'section':
            case 'footer':
            case 'main':
            case 'div':
            case 'span':
            case 'button':
            case 'form':
            case 'article':
              element.style.backgroundImage = currentImage;
              break;
          }
          let evt = new CustomEvent('lazyloaded');
          element.dispatchEvent(evt);
          imageObserver.unobserve(element);
        }
      });
    });

        for (let i = 0; i < elements.length; i++) {
      imageObserver.observe(elements[i]);
    }

        window.addEventListener('resize', function() {
      for (let i = 0; i < elements.length; i++) {
        imageObserver.unobserve(elements[i]);
        imageObserver.observe(elements[i]);
      }
    });
  };

  return lazyload;
});