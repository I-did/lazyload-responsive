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