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
        mediaAttr: 'data-media',
        clearSrc: false,
        clearMedia: false
      };

          _.elements = [];
      _.currentPixelRatio = {};
      _.imageObserver = null;
      _.resizeHandler = {
        handleEvent: _.windowResizeEvent,
        ctx: _
      };

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
    let _ = this;

        _.createImgLazyObject();
    _.getPxRatio();
    _.createObserver();
    _.startObserve();

        window.addEventListener('resize', _.resizeHandler);

  };

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
  };

  lazyload.prototype.imgSrcParse = function(imageSrc, regExps) {
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
  };

  lazyload.prototype.getPxRatio = function() {
    let _ = this,
      windowPixelRatio = +window.devicePixelRatio.toFixed(1),
      str,
      num;


        for (let i = 1; i < 10; i++) {
      if (i === 1) {
        if (windowPixelRatio <= i) {
          str = i + 'x';
          num = i;
          break;
        }
      } else {
        if (windowPixelRatio > i - 1 && windowPixelRatio <= i)  {
          str = i + 'x';
          num = i;
          break;
        }
      }
    }

        _.currentPixelRatio.str = str;
    _.currentPixelRatio.num = num;
  };

  lazyload.prototype.createObserver = function() {
    let _ = this;

        _.imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let element = entry.target,
            {src, media} = element.lazyObject,
            currentImage,
            currentMediaQuery;

              for (let key in media) {  
            if (key !== 'length') {
              if (matchMedia(key).matches) {
                currentMediaQuery = key;
              }
            }
          }


              let obj = (currentMediaQuery) ? media[currentMediaQuery] : (!currentImage) ? src : '';

              currentImage = _.setImg(obj);

              switch(element.tagName.toLowerCase()) { 
            case 'img':
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

              if (typeof window.CustomEvent === "function") {
            let evt = new CustomEvent('lazyloaded');
            element.dispatchEvent(evt);
          }

                    _.imageObserver.unobserve(element);
        }
      });
    });

  };

  lazyload.prototype.startObserve = function(images) {
    let _ = this,
      elements = images || _.elements;

        for (let i = 0; i < elements.length; i++) {
      _.imageObserver.observe(elements[i]);
    }
  };

  lazyload.prototype.setImg = function(target) {  

        let _ = this,
      currentImage = '';

        if (typeof target === 'string') { 
      currentImage = target;
    } else {  

          let img = target[_.currentPixelRatio.str];

          if (!img) { 

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
  };

  lazyload.prototype.windowResizeEvent = function(ctx) {
    let _ = this.ctx || this,
      elements = _.elements;

        _.getPxRatio();

        for (let i = 0; i < elements.length; i++) {
      _.imageObserver.unobserve(elements[i]);
      _.imageObserver.observe(elements[i]);
    }
  };

  lazyload.prototype.destroy = function() {  
    let _ = this;

        window.removeEventListener('resize', _.resizeHandler);
    _.imageObserver.disconnect();

        for (let i = 0; i < _.elements.length; i++) {
      delete _.elements[i].lazyObject;
    }

        _.elements = [];
    _.currentPixelRatio = {};
    _.imageObserver = null;
  };

  lazyload.prototype.refresh = function() {  
    let _ = this,
      allElements = document.querySelectorAll(_.options.elements),
      newElements = [];

          for (let i = 0; i < allElements.length; i++) {
        if (!allElements[i].lazyObject) {
          newElements.push(allElements[i]);
        }
      }

          _.createImgLazyObject(newElements);
      _.startObserve(newElements);

          window.removeEventListener('resize', _.resizeHandler);
      window.addEventListener('resize', _.resizeHandler);

  };


  return lazyload;
});