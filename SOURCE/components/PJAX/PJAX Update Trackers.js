function PJAXUpdateTrackers() {
	updateGA();
	updateFBPixel();
	updateYaMetrika();

	/**
	 * Google Analytics
	 */
	function updateGA() {
		if (typeof gtag === 'function' && typeof window.gaData === 'object' && Object.keys(window.gaData)[0] !== 'undefined') {
			const
				trackingID = Object.keys(window.gaData)[0],
				pageRelativePath = (window.location.href).replace(window.location.origin, '');

			gtag('js', new Date());
			gtag('config', trackingID, {
				'page_title': document.title,
				'page_path': pageRelativePath
			});
		}
	}

	/**
	 * Facebook Pixel
	 */
	function updateFBPixel() {
		if (typeof fbq === 'function') {
			fbq('track', 'PageView');
		}
	}

	/**
	 * Yandex Metrika
	 */
	function updateYaMetrika() {
		if (typeof ym === 'function') {
			const trackingID = getYmTrackingNumber();

			ym(trackingID, 'hit', window.location.href, {
				title: document.title
			});
		}
	}

	function getYmTrackingNumber() {
		if (typeof window.Ya !== 'undefined' && typeof window.Ya.Metrika2) {
			return window.Ya.Metrika2.counters()[0].id || null;
		}

		if (typeof window.Ya !== 'undefined' && typeof window.Ya.Metrika) {
			return window.Ya.Metrika.counters()[0].id || null;
		}

		return null;
	}
}
