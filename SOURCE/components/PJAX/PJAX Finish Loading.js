function PJAXFinishLoading(data) {
	return new Promise((resolve) => {
		const $transitionCurtains = $('#js-page-transition-curtain, #js-header-curtain-transition');

		// Clear transition curtains
		gsap.effects.setCurtain($transitionCurtains, {
			display: 'none',
		});

		// Transition ended event
		window.dispatchEvent(new CustomEvent('arts/barba/transition/end'));

		// Hide spinner
		if (typeof window.$spinner !== 'undefined' && window.$spinner.length) {
			gsap.to(window.$spinner, 0.6, {
				autoAlpha: 0
			});
		}

		// audio backgrounds
		if (typeof window.AudioBackground !== 'undefined') {

			if (window.AudioBackground.isAudioSrc()) {
				window.AudioBackground.controller.reveal(true);
			} else {
				window.AudioBackground.controller.reveal(false);
			}
		}

		// Re-init page header
		if (typeof window.theme.header !== 'undefined') {
			window.theme.header.run();
		}

		// re-enable ScrollMagic scenes
		window.SMController.enabled(true);
		window.SMController.update(true);

		setTimeout(() => {

			// remove cloned image if it exists
			$('.clone').remove();

			// unlock scroll
			Scroll.lock(false);

			window.$barbaWrapper.removeClass('cursor-progress');
			$('.menu').removeClass('menu_disabled');

		}, 100);

		// scroll to anchor from URL hash
		Scroll.scrollToAnchorFromHash(600);

		resolve(true);
	});
}
