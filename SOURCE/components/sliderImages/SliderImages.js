class SliderImages extends Slider {
	constructor({
		scope,
		target
	}) {
		super({
			target,
			scope
		});
	}

	set() {

		this.$slider = this.$el.find('.js-slider-images__slider');

		// counter
		this.$counterCurrent = this.$el.find('.js-slider__counter-current');
		this.$counterTotal = this.$el.find('.js-slider__counter-total');
		this.counterStyle = this.$slider.data('counter-style') || 'roman';
		this.counterZeros = this.$slider.data('counter-add-zeros') || 0;

		// dragging
		this.dragMouse = this.$slider.data('drag-mouse') || false;
		this.dragCursor = this.$slider.data('drag-cursor') || false;
		this.dragClass = this.$slider.data('drag-class') || '';

		// dots
		this.$sliderDots = this.$el.find('.js-slider__dots');
	}

	run() {
		this.breakpoints = this._setBreakPoints();
		this.slider = this._getSlider();
		this.sliderCounter = this._getSliderCounter({
			slider: this.slider,
			counter: {
				current: this.$counterCurrent,
				total: this.$counterTotal,
				style: this.counterStyle,
				zeros: this.counterZeros
			}
		});

		// dots
		if (this.$sliderDots.length) {
			this._getSliderDots({
				slider: this.slider,
				container: this.$sliderDots
			});
		}

		// slider drag
		if (this.dragCursor) {
			this._emitDragEvents({
				slider: this.slider,
				target: document,
				customClass: this.dragClass
			});
		}

		// pause autoplay
		if (this.slider.params.autoplay.enabled) {
			this._pauseAutoplay({
				slider: this.slider,
			});
		}

		this._bindEvents();
	}

	_bindEvents() {
		// update height after images are loaded
		this.slider.on('lazyImageReady', () => {
			this.slider.update();
		});

		window.$window
			.on('arts/barba/transition/end', () => {
				this.slider.update();
			})
			.on('arts/preloader/end', () => {
				this.slider.update();
			});

		// update slider geometry as images load
		this.$el.imagesLoaded().progress({
			background: true
		}, (e) => {
			setTimeout(() => {
				this.slider.update();
			}, 300);
		});

		setTimeout(() => {
			this.slider.updateAutoHeight();
		}, 300);

	}

	_setBreakPoints() {
		const
			breakpoints = {},
			lg = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.lg - 1 : 1024,
			md = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.md - 1 : 767;

		breakpoints[lg] = {
			slidesPerView: this.$slider.data('slides-per-view') || 1,
			spaceBetween: this.$slider.data('space-between') || 0,
			centeredSlides: this.$slider.data('centered-slides') || false,
		};
		breakpoints[md] = {
			slidesPerView: this.$slider.data('slides-per-view-tablet') || 1.33,
			spaceBetween: this.$slider.data('space-between-tablet') || 20,
			centeredSlides: this.$slider.data('centered-slides-tablet') || true,
		};
		breakpoints[0] = {
			slidesPerView: this.$slider.data('slides-per-view-mobile') || 1.16,
			spaceBetween: this.$slider.data('space-between-mobile') || 10,
			centeredSlides: this.$slider.data('centered-slides-mobile') || true,
		};

		return breakpoints;
	}

	_getSlider() {
		return new Swiper(this.$slider[0], {
			simulateTouch: this.dragMouse ? true : false,
			autoHeight: this.$slider.data('auto-height'),
			speed: this.$slider.data('speed') || 1200,
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 3,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			touchRatio: this.$slider.data('touch-ratio') || 2,
			observer: true,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			centeredSlides: this.$slider.data('centered-slides') || false,
			slidesPerView: 1,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$slider.data('autoplay-enabled') || false,
				delay: this.$slider.data('autoplay-delay') || 6000,
			},
			spaceBetween: this.$slider.data('space-between') || 60,
			pagination: {
				el: this.$el.find('.js-slider__dots').get(0),
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
			navigation: {
				nextEl: this.$el.find('.js-slider__arrow-next'),
				prevEl: this.$el.find('.js-slider__arrow-prev'),
			},
			breakpoints: this.breakpoints,
			parallax: true,
			touchEventsTarget: 'container',
			keyboard: {
				enabled: true,
				onlyInViewport: true
			},
			mousewheel: this.$slider.data('mousewheel-enabled') ? {
				eventsTarged: this.$el.get(0),
				eventsTarget: this.$el.get(0),
				releaseOnEdges: true,
			} : false,
		});
	}
}
