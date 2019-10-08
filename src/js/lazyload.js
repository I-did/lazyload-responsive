;(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		window.lazyload = factory();
	}
})(function() {
	let _,
		opt = {},
		id = 0;

	class lazyload {
		constructor(selectors, options) {
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

			for (let name in _.defaults) {
				if (opt[name] === undefined) {
					opt[name] = _.defaults[name];
				}
			}
			_.init();
		}

		init() {
			let elements = [...document.querySelectorAll(opt.selector)];

			_.elements = elements.map((el, i) => ({
				id: i,
				tag: el,
				dataSrc: el.getAttribute(opt.srcAttr) || el.getAttribute('data-poster'),
				media: el.hasAttribute(opt.mediaAttr) && el.getAttribute(opt.mediaAttr).replace(/\n*\t*/g, ''),
				load(observe) {
					let currentMedia = this.checkMedia(this.firstMedia, this.otherMedia),
						images = (this.media && currentMedia) ? this.mediaQuiries[currentMedia] : this.dataSrc,
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
								tag.addEventListener('load', function() {
									_.loadNextElem();
								}, {once: true});
							} else if (opt.mode === 'embed') {
								console.log('msg');
								_.loadNextElem();
							}

	 					} else if (tag.tagName === 'VIDEO') {
	 						tag.setAttribute('poster', this.dataSrc);
	 						for (let child of tag.children) {
	 							if (child.tagName === 'SOURCE' || child.tagName === 'TRACK') {
	 								child.setAttribute('src', child.getAttribute('data-src'));
	 							}
	 						}
	 						tag.load();
	 					} else {
	 						if (opt.mode !== 'observe') {
	 							tag.addEventListener('loaded', function() {
									_.loadNextElem();
								}, {once: true});
	 						}		 						

	 						tag.style.backgroundImage = '';

	 						if (opt.mode === 'progressive') {
								this.progressiveLoadBackgrounds(images);
							} else {
								for (let i = 0; i < images.length; i++) {
									if (images[i].search(/gradient\(.*?\)|url\(.*?\)/) === -1) {
										images[i] = images[i].replace(/.*/, 'url($&)');
									}
									this.currentUrl.push(images[i]);
								}

								tag.style.backgroundImage = String(images);
								tag.dispatchEvent(new Event('loaded'));
							}
	 					}
 					}		
				},
				progressiveLoadBackgrounds(images, num) {
					let i = ++num || 0;

					if (images[i]) {
						let url,
							img = document.createElement('img');

						this.currentUrl.push(images[i]);

						if (images[i].search(/gradient\(.*?\)|url\(.*?\)/) === -1) {
							url = images[i].replace(/.*/, 'url($&)');
						} else url = images[i];

						this.tag.style.backgroundImage += (i !== 0) ? `,${url}` : url;

						if (images[i].search(/gradient\(.*?\)/) !== -1) {
							this.progressiveLoadBackgrounds(images, i);
						}	else {
							img.setAttribute('src', images[i].replace(/url\((.*)\)/, '$1'));
							img.addEventListener('load', () =>	this.progressiveLoadBackgrounds(images, i), {once: true});
						}

					} else this.tag.dispatchEvent(new Event('loaded'));
				},
				checkMedia: function(firstMedia, otherMedia) {

					if (this.media) {
						return (new Function('firstMedia', 'otherMedia', `
							if (window.matchMedia('${firstMedia}').matches) {
								return '${firstMedia}';
							} ${(function() {
								if (otherMedia.length === 0) return '';
								let str = '';
								for (let i = 0; i < otherMedia.length; i++) {
									str += `else if (window.matchMedia('${otherMedia[i]}').matches) {return '${otherMedia[i]}'}`;
								}
								str += `else {
									return false;
								}`;
								return str;
							})()}
					 `))();
					}
				}
			}));

			_.prepareElements();
		}

		prepareElements() {
			window.addEventListener('load', function() {
				let cut = /(?:\,\s?)(?=url|linear|radial|conic|repeating|(?:\.(?!\d))|\/)/;
				_.elements.forEach(function(el) {

					el.content = el.dataSrc.search(/<.*?>/) !== -1;

					// cut gradients
					el.dataSrc = el.dataSrc.replace(/\n*\t*/g, '').split(cut);
					
					if (el.media) {
						el.mediaQuiries = {};
						el.mediaArray = [];

						let mediaArray = el.media.split(';'),
							mediaQuery,
							minMedia,
							maxMedia;


							for (let media of mediaArray) {
								media = media.replace(/(.*?){/, function(match, p1) {
									mediaQuery = p1;
								return '';
								}).replace(/}$/, '').split(cut);
								el.mediaQuiries[mediaQuery] = media;
								el.mediaArray.push(mediaQuery);
							}

						_.minmax(el, minMedia, 'min');
						_.minmax(el, maxMedia, 'max');

						if (el.mediaArray.every(elem => elem.includes('max-width'))) {
							el.mediaArray.reverse();
					 		el.firstMedia = el.minMedia;
						} else if (el.mediaArray.every(elem => elem.includes('min-width'))) {
							el.firstMedia = el.maxMedia;
							el.mediaArray.reverse();
						} else {
							el.firstMedia = el.mediaArray[0];
						}

						el.otherMedia = el.mediaArray.filter(e => el.firstMedia !== e);

					}
				});

				if (opt.mode === 'observe') {
					_.observer();
				} else {
					_.loadNext();
				}
				
				setTimeout(() => {
					window.addEventListener('resize', () => {
						id = 0;
						_.loadNext();
					});
				}, 10);
				
			}, {once: true});
		}

		observer() {
			let wndwScroll = {
				top: pageYOffset,
				bottom: pageYOffset + window.screen.height
			};

			for (let el of _.elements) {
				el.posTop = el.tag.getBoundingClientRect().top + pageYOffset;
				el.posBottom = el.tag.getBoundingClientRect().bottom + pageYOffset;
				el.observed = true;
			}

			function windowObserver() {

				wndwScroll.top = pageYOffset;
				wndwScroll.bottom = pageYOffset + window.screen.height;

				for (let el of _.elements) {
					if (el.observed && el.posBottom > wndwScroll.top && el.posTop < wndwScroll.bottom) {
						el.load(true);
						el.observed = false;
					}
				}
			}

			windowObserver();
			window.addEventListener('scroll', windowObserver);
		}

		arrayEquality(arr1, arr2) {
			if (!arr2) {
				return false;
			}

			if (arr1.length !== arr2.length) {
				return false;
			}

			for (let i = 0; i < arr1.length; i++) {
				if (arr1[i] !== arr2[i]) {
					return false;
				}
			}

			return true;
		}

		minmax(el, media, arg) {
			media = Math[arg].apply(Math, el.mediaArray.map(el => _.getMediaNumber(el) ));
			el[`${arg}Media`] = el.mediaArray.find(el => el.search(media) !== -1);
		}

		getMediaNumber(str) {
			return +str.replace(/[^0-9|\.]/g, '');
		}

		loadNextElem() {
			id++;
			_.loadNext();
		}

		loadNext() {
			if (_.elements[id]) {
				_.elements[id].load();
			}
		}

	}
	return lazyload;
});