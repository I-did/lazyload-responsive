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
	}
	return lazyload;
});