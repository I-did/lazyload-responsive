(function () {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        var ce = new window.CustomEvent('test', {cancelable: true});
        ce.preventDefault();
        if (ce.defaultPrevented !== true) {
            throw new Error('Could not prevent default');
        }
    } catch(e) {
        var CustomEvent = function(event, params) {
            var evt, origPrevent;
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

            evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            origPrevent = evt.preventDefault;
            evt.preventDefault = function () {
                origPrevent.call(this);
                try {
                    Object.defineProperty(this, 'defaultPrevented', {
                        get: function () {
                            return true;
                        }
                    });
                } catch(e) {
                    this.defaultPrevented = true;
                }
            };
            return evt;
        };

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent; // expose definition to window
    }
})();

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.filter){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
        throw new TypeError();
   
    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;

    var kValue;
    if (thisArg === undefined){
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          kValue = t[i]; // in case t is changed in callback
          if (func(t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }
    else{
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          kValue = t[i];
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }
   
    res.length = c; // shrink down array to proper size
    return res;
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      var len = o.length >>> 0;

      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }
      var thisArg = arguments[1];

      var k = 0;
      while (k < len) {
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        k++;
      }

      return undefined;
    },
    configurable: true,
    writable: true
  });
}

if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    A = new Array(len);
    k = 0;
    while (k < len) {

      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function (factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.lazyload = factory();
  }
})(function () {
  var _,
      opt = {},
      id = 0;

  var lazyload =
  /*#__PURE__*/
  function () {
    function lazyload(selectors, options) {
      _classCallCheck(this, lazyload);

      _ = this;
      _.defaults = {
        mode: 'observe',
        selector: '.lazy',
        srcAttr: 'data-src',
        mediaAttr: 'data-media'
      };

      if (selectors) {
        if (typeof selectors === 'string') {
          opt = _.options = options;
          opt.selector = selectors;
        } else {
          opt = _.options = selectors;
        }
      }

      for (var name in _.defaults) {
        if (opt[name] === undefined) {
          opt[name] = _.defaults[name];
        }
      }

      _.init();
    }

    _createClass(lazyload, [{
      key: "init",
      value: function init() {
        var elements = function () {
          var arr = [],
              els = document.querySelectorAll(opt.selector);

          for (var i = 0; i < els.length; i++) {
            arr.push(els[i]);
          }
          return arr;
        }();

        _.elements = elements.map(function (el, i) {
          return {
            id: i,
            tag: el,
            dataSrc: el.getAttribute(opt.srcAttr) || el.getAttribute('data-poster'),
            media: el.hasAttribute(opt.mediaAttr) && el.getAttribute(opt.mediaAttr).replace(/\n*\t*/g, ''),
            load: function (observe) {
              var currentMedia = this.checkMedia(this.firstMedia, this.otherMedia),
                  images = this.media && currentMedia ? this.mediaQuiries[currentMedia] : this.dataSrc,
                  tag = this.tag;

              if (_.arrayEquality(images, this.currentUrl) || tag.innerHTML === String(this.dataSrc)) {
                _.loadNextElem();

                return;
              } else this.currentUrl = [];

              if (this.content) {
                tag.innerHTML += this.dataSrc;

                _.loadNextElem();
              } else {
                if (tag.tagName === 'IMG' || tag.tagName === 'IFRAME') {
                  tag.src = images;
                  this.currentUrl.push(images[i]);

                  if (opt.mode === 'progressive') {
                    tag.addEventListener('load', function () {
                      _.loadNextElem();
                    }, {
                      once: true
                    });
                  } else if (opt.mode === 'embed') {
                    console.log('msg');

                    _.loadNextElem();
                  }
                } else if (tag.tagName === 'VIDEO') {
                  tag.setAttribute('poster', this.dataSrc);

                  // for (var child of tag.children) {
                  //   if (child.tagName === 'SOURCE' || child.tagName === 'TRACK') {
                  //     child.setAttribute('src', child.getAttribute('data-src'));
                  //   }
                  // }
                  for (var i = 0; i < tag.children.length; i++) {
                    if (tag.children[i].tagName === 'SOURCE' || tag.children[i].tagName === 'TRACK') {
                      tag.children[i].setAttribute('src', tag.children[i].getAttribute('data-src'));
                    }
                  }

                  tag.load();
                } else {
                  if (opt.mode !== 'observe') {
                    tag.addEventListener('loaded', function () {
                      _.loadNextElem();
                    }, {
                      once: true
                    });
                  }

                  tag.style.backgroundImage = '';

                  if (opt.mode === 'progressive') {
                    this.progressiveLoadBackgrounds(images);
                  } else {
                    for (var i = 0; i < images.length; i++) {
                      if (images[i].search(/gradient\(.*?\)|url\(.*?\)/) === -1) {
                        images[i] = images[i].replace(/.*/, 'url($&)');
                      }

                      this.currentUrl.push(images[i]);
                    }

                    tag.style.backgroundImage = String(images);
                    var e = new CustomEvent('loaded');
                   // tag.dispatchEvent(new Event('loaded'));
                   tag.dispatchEvent(e);
                  }
                }
              }
            },
            progressiveLoadBackgrounds: function (images, num) {
              var _this = this;

              var i = ++num || 0;

              if (images[i]) {
                var url,
                    img = document.createElement('img');
                this.currentUrl.push(images[i]);

                if (images[i].search(/gradient\(.*?\)|url\(.*?\)/) === -1) {
                  url = images[i].replace(/.*/, 'url($&)');
                } else url = images[i];

                this.tag.style.backgroundImage += i !== 0 ? ",".concat(url) : url;

                if (images[i].search(/gradient\(.*?\)/) !== -1) {
                  this.progressiveLoadBackgrounds(images, i);
                } else {
                  img.setAttribute('src', images[i].replace(/url\((.*)\)/, '$1'));
                  img.addEventListener('load', function () {
                    return _this.progressiveLoadBackgrounds(images, i);
                  }, {
                    once: true
                  });
                }
              } else this.tag.dispatchEvent(new Event('loaded'));
            },
            checkMedia: function (firstMedia, otherMedia) {
              if (this.media) {
                return new Function('firstMedia', 'otherMedia', "\n\t\t\t\t\t\t\tif (window.matchMedia('".concat(firstMedia, "').matches) {\n\t\t\t\t\t\t\t\treturn '").concat(firstMedia, "';\n\t\t\t\t\t\t\t} ").concat(function () {
                  if (otherMedia.length === 0) return '';
                  var str = '';

                  for (var i = 0; i < otherMedia.length; i++) {
                    str += "else if (window.matchMedia('".concat(otherMedia[i], "').matches) {return '").concat(otherMedia[i], "'}");
                  }

                  str += "else {\n\t\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t\t}";
                  return str;
                }(), "\n\t\t\t\t\t "))();
              }
            }
          };
        });

        _.prepareElements();
      }
    }, {
      key: "prepareElements",
      value: function prepareElements() {
        window.addEventListener('load', function () {
          var cut = /(?:\,\s?)(?=url|linear|radial|conic|repeating|(?:\.(?!\d))|\/)/;

          _.elements.forEach(function (el) {
            el.content = el.dataSrc.search(/<.*?>/) !== -1; // cut gradients

            el.dataSrc = el.dataSrc.replace(/\n*\t*/g, '').split(cut);

            if (el.media) {
              el.mediaQuiries = {};
              el.mediaArray = [];
              var mediaArray = el.media.split(';'),
                  mediaQuery,
                  minMedia,
                  maxMedia;

              // for (var media of mediaArray) {
              //   media = media.replace(/(.*?){/, function (match, p1) {
              //     mediaQuery = p1;
              //     return '';
              //   }).replace(/}$/, '').split(cut);
              //   el.mediaQuiries[mediaQuery] = media;
              //   el.mediaArray.push(mediaQuery);
              // }

              for (var i = 0; i < mediaArray.length; i++) {
                mediaArray[i] = mediaArray[i].replace(/(.*?){/, function (match, p1) {
                  mediaQuery = p1;
                  return '';
                }).replace(/}$/, '').split(cut);
                el.mediaQuiries[mediaQuery] = mediaArray[i];
                el.mediaArray.push(mediaQuery);
              }

              _.minmax(el, minMedia, 'min');

              _.minmax(el, maxMedia, 'max');

              if (el.mediaArray.every(function (elem) {
                return elem.includes('max-width');
              })) {
                el.mediaArray.reverse();
                el.firstMedia = el.minMedia;
              } else if (el.mediaArray.every(function (elem) {
                return elem.includes('min-width');
              })) {
                el.firstMedia = el.maxMedia;
                el.mediaArray.reverse();
              } else {
                el.firstMedia = el.mediaArray[0];
              }

              el.otherMedia = el.mediaArray.filter(function (e) {
                return el.firstMedia !== e;
              });
            }
          });

          if (opt.mode === 'observe') {
            _.observer();
          } else {
            _.loadNext();
          }

          setTimeout(function () {
            window.addEventListener('resize', function () {
              id = 0;

              _.loadNext();
            });
          }, 10);
        }, {
          once: true
        });
      }
    }, {
      key: "observer",
      value: function observer() {
        var wndwScroll = {
          top: pageYOffset,
          bottom: pageYOffset + window.screen.height
        };

        // for (var el of _.elements) {
        //   el.posTop = el.tag.getBoundingClientRect().top + pageYOffset;
        //   el.posBottom = el.tag.getBoundingClientRect().bottom + pageYOffset;
        //   el.observed = true;
        // }

        for (var i = 0; i < _.elements.length; i++) {
          _.elements[i].posTop = _.elements[i].tag.getBoundingClientRect().top + pageYOffset;
          _.elements[i].posBottom = _.elements[i].tag.getBoundingClientRect().bottom + pageYOffset;
          _.elements[i].observed = true;
        }

        function windowObserver() {
          wndwScroll.top = pageYOffset;
          wndwScroll.bottom = pageYOffset + window.screen.height;

          // for (var el of _.elements) {
          //   if (el.observed && el.posBottom > wndwScroll.top && el.posTop < wndwScroll.bottom) {
          //     el.load(true);
          //     el.observed = false;
          //   }
          // }

          for (var i = 0; i < _.elements.length; i++) {
            if (_.elements[i].observed && _.elements[i].posBottom > wndwScroll.top && _.elements[i].posTop < wndwScroll.bottom) {
              _.elements[i].load(true);
              _.elements[i].observed = false;
            }
          }
        }

        windowObserver();
        window.addEventListener('scroll', windowObserver);
      }
    }, {
      key: "arrayEquality",
      value: function arrayEquality(arr1, arr2) {
        if (!arr2) {
          return false;
        }

        if (arr1.length !== arr2.length) {
          return false;
        }

        for (var i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }

        return true;
      }
    }, {
      key: "minmax",
      value: function minmax(el, media, arg) {
        media = Math[arg].apply(Math, el.mediaArray.map(function (el) {
          return _.getMediaNumber(el);
        }));
        el["".concat(arg, "Media")] = el.mediaArray.find(function (el) {
          return el.search(media) !== -1;
        });
      }
    }, {
      key: "getMediaNumber",
      value: function getMediaNumber(str) {
        return +str.replace(/[^0-9|\.]/g, '');
      }
    }, {
      key: "loadNextElem",
      value: function loadNextElem() {
        id++;

        _.loadNext();
      }
    }, {
      key: "loadNext",
      value: function loadNext() {
        if (_.elements[id]) {
          _.elements[id].load();
        }
      }
    }]);

    return lazyload;
  }();

  return lazyload;
});