class SliderTestimonials extends Slider {
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
		// counter
		this.$counterCurrent = this.$target.find('.js-slider-testimonials__counter-current');
		this.$counterTotal = this.$target.find('.js-slider-testimonials__counter-total');
		this.counterStyle = this.$target.data('counter-style') || 'roman';
		this.counterZeros = this.$target.data('counter-add-zeros') || 0;
		this.$text = this.$target.find('.slider-testimonials__text');

		// params
		this.dragCursor = this.$target.data('drag-cursor') || false;
		this.dragClass = this.$target.data('drag-class') || '';

		// dots
		this.$sliderDots = this.$target.find('.js-slider__dots');
	}

	run() {
		this.breakpoints = this._setBreakPoints();
		this.slider = this._getSlider();

		// counter
		if (this.$counterCurrent.length) {
			this.sliderCounter = this._getSliderCounter({
				slider: this.slider,
				counter: {
					current: this.$counterCurrent,
					total: this.$counterTotal,
					style: this.counterStyle,
					zeros: this.counterZeros
				}
			});
		}

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

		// text transitions
		this._setSliderTextTransitions();

		this._bindEvents();
	}

	_bindEvents() {
		// update height after images are loaded
		this.slider.on('lazyImageReady', () => {
			this.slider.update();
		});

		// update slider geometry as images load
		this.$target.imagesLoaded().progress({
			background: true
		}, (e) => {
			setTimeout(() => {
				this.slider.update();
			}, 300);
		});

	}

	_setBreakPoints() {
		const
			breakpoints = {},
			lg = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.lg - 1 : 1024,
			md = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.md - 1 : 767;

		breakpoints[lg] = {
			slidesPerView: this.$target.data('slides-per-view') || 1,
			spaceBetween: this.$target.data('space-between') || 0,
			centeredSlides: this.$target.data('centered-slides') || false,
		};
		breakpoints[md] = {
			slidesPerView: this.$target.data('slides-per-view-tablet') || 1.33,
			spaceBetween: this.$target.data('space-between-tablet') || 20,
			centeredSlides: this.$target.data('centered-slides-tablet') || true,
		};
		breakpoints[320] = {
			slidesPerView: this.$target.data('slides-per-view-mobile') || 1.16,
			spaceBetween: this.$target.data('space-between-mobile') || 10,
			centeredSlides: this.$target.data('centered-slides-mobile') || true,
		};

		return breakpoints;
	}

	_getSlider() {
		return new Swiper(this.$target[0], {
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			virtualTranslate: true,
			allowTouchMove: false,
			direction: 'horizontal',
			autoHeight: true,
			speed: this.$target.data('speed') || 1200,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			pagination: {
				el: this.$el.find('.js-slider__dots').get(0),
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
			navigation: {
				nextEl: this.$el.find('.js-slider__arrow-next').get(0),
				prevEl: this.$el.find('.js-slider__arrow-prev').get(0),
			},
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 3,
				loadOnTransitionStart: true
			},
		});
	}

	_setSliderTextTransitions() {
		return new SliderTextTransitions({
			slider: this.slider,
			offset: 50,
			description: this.$text
		});
	}
}
