class SliderFullscreenProjects extends Slider {
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
		// sliders
		this.$sliderImg = this.$target.find('.js-slider-fullscreen-projects__images');
		this.$sliderContent = this.$target.find('.js-slider-fullscreen-projects__content');
		this.$sliderFooter = this.$target.find('.js-slider-fullscreen-projects__footer');

		// canvas for WebGL effects
		this.$canvas = this.$target.find('.slider__canvas');
		this.$canvasWrapper = this.$target.find('.slider__wrapper-canvas-inner');

		// content
		this.$heading = this.$target.find('.slider__heading');
		this.$subheading = this.$target.find('.slider__subheading');
		this.$description = this.$target.find('.slider__text');
		this.$link = this.$target.find('.slider__wrapper-button');
		this.$images = this.$sliderImg.find('.slider__images-slide-inner');

		// params
		this.sliderSpeed = this.$sliderImg.data('speed') || 600;
		this.isSliderReveal = this.$target.hasClass('js-slider-reveal');
		this.revealClass = 'slider-fullscreen-projects__images_reveal';

		// dragging
		this.dragMouse = this.$sliderImg.data('drag-mouse') || false;
		this.dragCursor = this.$sliderImg.data('drag-cursor') || false;
		this.dragClass = this.$sliderImg.data('drag-class') || '';

		this.transitionEffect = this.$sliderImg.data('transition-effect');
		this.effectIntensity = this.$sliderImg.data('transition-effect-intensity') || 0.2;
		this.displacementImage = this.$sliderImg.data('transition-displacement-img') || '';
		this.aspectRatio = this.$sliderImg.data('aspect-ratio') || 1.5;

		// counter
		this.$counterCurrent = this.$target.find('.js-slider-fullscreen-projects__counter-current');
		this.$counterTotal = this.$target.find('.js-slider-fullscreen-projects__counter-total');
		this.counterStyle = this.$sliderImg.data('counter-style') || 'roman';
		this.counterZeros = this.$sliderImg.data('counter-add-zeros') || 0;

		// categories
		this.$sliderCategories = this.$target.find('.js-slider__categories');

		// dots
		this.$sliderDots = this.$target.find('.js-slider__dots');
	}

	run() {
		// Swiper instances
		this.sliderImg = this._getSliderImages();
		this.sliderContent = this._getSliderContent();
		this.sliderCounter = this._getSliderCounter({
			slider: this.sliderImg,
			counter: {
				current: this.$counterCurrent,
				total: this.$counterTotal,
				style: this.counterStyle,
				zeros: this.counterZeros
			}
		});
		this.sliderFooter = this._getSliderFooter();

		// distortion effect
		if (this._isDistortionEffect()) {
			this.distortionEffect = this._setSliderDistortionEffect();
		}

		// connect sliders
		this.sliderImg.controller.control.push(this.sliderContent);
		this.sliderContent.controller.control.push(this.sliderImg);

		// text transitions
		this._setSliderTextTransitions();

		// slider drag
		if (this.dragCursor) {
			this._emitDragEvents({
				slider: this.sliderImg,
				target: document,
				customClass: this.dragClass
			});
		}

		// pause autoplay
		if (this.sliderImg.params.autoplay.enabled) {
			this._pauseAutoplay({
				slider: this.sliderImg,
			});
		}

		// set reveal backgrounds
		if (this.isSliderReveal) {
			this._setSliderReveal();
		}

		// dots
		if (this.$sliderDots.length) {
			this._getSliderDots({
				slider: this.sliderImg,
				container: this.$sliderDots
			});
		}

		// categories indicator
		if (this.$sliderCategories.length) {
			this._getCategoriesSlider();
		}
	}

	_getSliderImages() {
		if (!this.$sliderImg.length) {
			return false;
		}

		return new Swiper(this.$sliderImg[0], {
			simulateTouch: this.dragMouse ? true : false,
			direction: this.$sliderImg.data('direction') || 'horizontal',
			slidesPerView: this.$sliderImg.data('slides-per-view') || 1,
			touchRatio: this._isDistortionEffect() ? 1 : this.$sliderImg.data('touch-ratio') || 1,
			effect: this.isSliderReveal ? 'fade' : 'slide',
			allowTouchMove: true,
			fadeEffect: {
				crossFade: true
			},
			centeredSlides: true,
			parallax: this._isDistortionEffect() ? false : true,
			speed: this.sliderSpeed,
			preloadImages: false,
			updateOnImagesReady: true,
			grabCursor: true,
			lazy: {
				loadPrevNextAmount: 4,
				loadPrevNext: true,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			keyboard: {
				enabled: true,
				onlyInViewport: true
			},
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$sliderImg.data('autoplay-enabled') || false,
				delay: this.$sliderImg.data('autoplay-delay') || 6000,
			},
			mousewheel: this.$sliderImg.data('mousewheel-enabled') ? {
				eventsTarged: this.$target.get(0),
				eventsTarget: this.$target.get(0),
				releaseOnEdges: true,
			} : false,
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
			controller: {
				control: [],
				by: 'container'
			}
		});
	}

	_getSliderContent() {
		if (!this.$sliderContent.length) {
			return false;
		}

		return new Swiper(this.$sliderContent[0], {
			// simulateTouch: this.dragMouse ? true : false,
			centeredSlides: true,
			nested: true,
			speed: this.sliderSpeed,
			autoHeight: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			virtualTranslate: true,
			allowTouchMove: false,
			touchRatio: this._isDistortionEffect() ? 1 : this.$sliderImg.data('touch-ratio') || 1,
			watchSlidesProgress: true,
			controller: {
				control: [],
				by: 'container'
			}
		});
	}

	_getSliderFooter() {
		if (this.$sliderFooter.length) {
			const sliderFooter = new Swiper(this.$sliderFooter[0], {
				centeredSlides: true,
				speed: this.sliderSpeed,
				effect: 'fade',
				fadeEffect: {
					crossFade: true
				},
				allowTouchMove: false
			});

			this.sliderImg.controller.control.push(sliderFooter);
		}
	}

	_setSliderReveal() {
		return new SliderHoverBackgrounds({
			target: this.$sliderImg,
			scope: this.$scope,
			sliderImg: this.sliderImg,
			images: this.$images,
			links: this.$sliderContent.find('a'),
			hoverClass: this.revealClass
		})
	}

	_getCategoriesSlider() {
		return new SliderCategories({
			target: this.$sliderCategories,
			scope: this.$scope,
			sliderContent: this.sliderContent,
			links: this.$sliderContent.find('a')
		});
	}

	_setSliderDistortionEffect() {
		this.sliderImg.params.preloadImages = false;
		this.sliderImg.params.lazy = false;
		this.sliderImg.params.effect = 'fade';
		this.sliderImg.params.fadeEffect.crossFade = true;

		return new SliderDistortionEffect({
			scope: this.$scope,
			slider: this.sliderImg,
			target: this.$sliderImg,
			intensity: this.effectIntensity,
			aspectRatio: this.aspectRatio,
			canvas: this.$canvas,
			canvasWrapper: this.$canvasWrapper,
			displacementImage: this.displacementImage
		});
	}

	_setSliderTextTransitions() {
		return new SliderTextTransitions({
			slider: this.sliderContent,
			direction: this.sliderImg.params.direction,
			offset: 50,
			heading: this.$heading,
			subheading: this.$subheading,
			description: this.$description,
			link: this.$link
		});
	}

	_isDistortionEffect() {
		return this.transitionEffect === 'distortion';
	}
}
