let _ = this;

window.removeEventListener('resize', _.resizeHandler);
_.imageObserver.disconnect();

for (let i = 0; i < _.elements.length; i++) {
  delete _.elements[i].lazyObject;
}

_.elements = [];
_.currentPixelRatio = {};
_.imageObserver = null;