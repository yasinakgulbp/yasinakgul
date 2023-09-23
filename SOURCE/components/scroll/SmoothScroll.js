class SmoothScroll {
	constructor({
		target = $('.js-smooth-scroll'),
		adminBar,
		absoluteElements,
		fixedElements
	}) {
		this.$container = target;
		this.$WPadminBar = adminBar;
		this.$absoluteElements = absoluteElements;
		this.$fixedElements = fixedElements;

		this.run();

		try {
			this._handleAnchorsScrolling();
		} catch (error) {

		}
	}

	run() {

		if (
			typeof window.Scrollbar === 'undefined' ||
			!window.theme.smoothScroll.enabled ||
			!this.$container ||
			!this.$container.length ||
			typeof window.elementor !== 'undefined' || // don't launch in Elementor edit mode
			(window.Modernizr.touchevents && !this.$container.hasClass('js-smooth-scroll_enable-mobile')) || // don't launch on touch devices
			window.Modernizr.touchevents
		) {
			return false;
		}

		if (typeof window.SB !== 'undefined') {
			window.SB.destroy();
		}

		this._registerPlugins();
		this.$container.addClass('smooth-scroll');

		window.SB = window.Scrollbar.init(this.$container[0], window.theme.smoothScroll);

		this._emitNativeScrollEvents();

		if (typeof this.$WPadminBar !== 'undefined' && this.$WPadminBar.length) {
			this._correctWPAdminBar();
		}

		if (typeof this.$absoluteElements !== 'undefined' && this.$absoluteElements.length) {
			this._correctAbsolutePositionElements();
		}

		if (typeof this.$fixedElements !== 'undefined' && this.$fixedElements.length) {
			this._correctFixedPositionElements();
		}

	}

	_registerPlugins() {
		if (window.theme.smoothScroll.plugins.edgeEasing && typeof SoftscrollPlugin !== 'undefined') {
			window.Scrollbar.use(SoftscrollPlugin);
		}
	}

	_emitNativeScrollEvents() {
		const scrollEvt = new CustomEvent('scroll');

		window.SB.addListener((e) => {
			window.pageYOffset = e.offset.y;
			window.pageXOffset = e.offset.x;
			window.dispatchEvent(scrollEvt);
		});
	}

	_handleAnchorsScrolling() {
		$('.page-wrapper__content, #page-footer').find('a[href*="#"]:not([href="#"])').each(function () {
			const
				$current = $(this),
				url = $current.attr('href'),
				filteredUrl = url.substring(url.indexOf('#'));

			if (filteredUrl.length) {
				const $el = $(filteredUrl);

				if ($el.length) {
					$current.off('click').on('click', function (e) {
						e.preventDefault();
						Scroll.scrollTo({
							y: $el.offset().top,
							duration: 800
						});
					});
				}
			}
		});
	}

	_correctWPAdminBar() {
		if (this.$WPadminBar.length) {
			window.$html.css({
				overflow: 'hidden'
			});
		}
	}

	_correctAbsolutePositionElements() {
		const barHeight = (this.$WPadminBar.length && this.$WPadminBar.height()) || 0;

		gsap.to(this.$absoluteElements, {
			y: 0,
			duration: 0.3
		});

		this.$absoluteElements.each(function () {
			const $el = $(this);

			window.SB.addListener((scrollbar) => {
				gsap.set($el, {
					y: -scrollbar.offset.y + barHeight
				});
			});
		});
	}

	_correctFixedPositionElements() {
		const barHeight = (this.$WPadminBar.length && this.$WPadminBar.height()) || 0;

		gsap.to(this.$fixedElements, {
			y: 0,
			duration: 0.3
		});

		this.$fixedElements.each(function () {
			const $el = $(this);

			window.SB.addListener((scrollbar) => {
				gsap.set($el, {
					y: scrollbar.offset.y + barHeight
				});
			});
		});
	}
}
