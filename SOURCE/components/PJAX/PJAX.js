class PJAX extends BaseComponent {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
	}

	run() {
		barba.init({
			sync: true,
			timeout: 10000,
			cacheIgnore: window.Modernizr.touchevents ? true : false, // don't grow cache on mobiles
			// don't trigger barba for links outside wrapper 
			prevent: ({
				el
			}) => {

				const
					$el = $(el),
					url = $el.attr('href'),
					exludeRules = [
						'.no-ajax',
						'.no-ajax a',
						'[data-elementor-open-lightbox]', // Elementor lightbox gallery
						'[data-elementor-lightbox-slideshow]', // Elementor Pro Gallery
						'.lang-switcher a', // Polylang & WPML language switcher
						'.js-gallery a', // any links in the template galleries
						'.js-album' // albums links
					];

				// page anchor
				if ($el.is('[href*="#"]') && window.location.href === url.substring(0, url.indexOf('#'))) {
					return true;
				}

				// page anchor
				if ($el.is('[href^="#"]')) {
					return true;
				}

				// elementor preview
				if (typeof elementor === 'object') {
					return true;
				}

				// clicked on elementor outside barba wrapper
				if ($el.closest(window.$barbaWrapper).length < 1) {
					return true;
				}

				// custom rules from WordPress Customizer
				if (window.theme.ajax.preventRules) {
					exludeRules.push(window.theme.ajax.preventRules);
				}

				// check against array of rules to prevent
				return $el.is(exludeRules.join(','));

			},
			// custom transitions
			transitions: [
				PJAXTransitionGeneral,
				PJAXTransitionFlyingImage,
				PJAXTransitionOverlayMenu,
				PJAXTransitionFullscreenSlider,
				PJAXTransitionListHover
			],

		});
	}

	static getNextPageElement({
		url,
		element
	}) {
		return new Promise((resolve) => {
			barba
				.request(url)
				.then((res) => {
					resolve($($.parseHTML(res)).find(element));
				});
		});
	}
}
