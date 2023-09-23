function PJAXStartLoading(data) {
	return new Promise((resolve) => {
		// Transition started event
		window.dispatchEvent(new CustomEvent('arts/barba/transition/start'));

		window.$barbaWrapper.addClass('cursor-progress');
		$('.menu').addClass('menu_disabled');

		Scroll.lock(true);
		window.$document.off('click resize');
		window.$window.off('resize click orientationchange');

		if (typeof window.$spinner !== 'undefined' && window.$spinner.length) {
			gsap.to(window.$spinner, 0.6, {
				autoAlpha: 1
			});
		}

		resolve(true);
	});
}
