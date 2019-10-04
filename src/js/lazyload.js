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
		constructor(options) {
			_ = this;
			_.defaults = {
				mode: 'progressive',
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

		}

		init() {
			let elements = [...document.querySelectorAll(opt.selector)];

			_.elements = elements.map((el, i) => ({
				id: i,
				tag: el,
				dataSrc: el.getAttribute(opt.srcAttr) || el.getAttribute('data-poster'),
				media: el.hasAttribute(opt.mediaAttr) && el.getAttribute(opt.mediaAttr).replace(/\n*\t*/g, '')
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