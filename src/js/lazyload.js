;(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		window.lazyload = factory();
	}
})(function() {
	class lazyload {
		constructor(options) {
			this.options = options;
			console.log(this);
		}
	}
	return lazyload;
});