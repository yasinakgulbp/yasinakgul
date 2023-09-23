class SectionProjectsSlider extends ScrollAnimation {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
	}
	set() {
		this.$slider = this.$el.find('.js-slider-fullscreen-projects');
		this.$sliderImg = this.$el.find('.slider-fullscreen-projects__images');
		this.$footer = this.$el.find('.slider-fullscreen-projects__footer');
		this.$canvasWrapper = this.$el.find('.slider__wrapper-canvas');
		this.$overlay = this.$el.find('.slider__overlay');
		this.$arrowLeft = this.$el.find('.slider__arrow_left .arrow-left');
		this.$arrowRight = this.$el.find('.slider__arrow_right .arrow-right');
		this.$counter = this.$el.find('.slider__wrapper-counter');

		this.slider = new SliderFullscreenProjects({
			scope: this.$scope,
			target: this.$slider
		});
		this.$activeSlide = this.$slider.find('.swiper-slide-active');
		this.$activeHeading = this.$activeSlide.find('.slider__heading');
		this.$activeSubheading = this.$activeSlide.find('.slider__subheading');
		this.$activeDescription = this.$activeSlide.find('.slider__text');
		this.$activeButton = this.$activeSlide.find('.slider__wrapper-button');
		this.$activeBg = this.$activeSlide.find('.slider__bg');
		this.activeBgScale = gsap.getProperty(this.$activeBg.get(0), 'scale') || 1;

		gsap.set(this.$canvasWrapper, {
			scale: 1.1,
			autoAlpha: 0,
			transformOrigin: 'center center'
		});

		gsap.set(this.$footer, {
			autoAlpha: 0,
			y: '100%'
		});

		gsap.set(this.$arrowLeft, {
			x: -50,
			autoAlpha: 0
		});

		gsap.set(this.$arrowRight, {
			x: 50,
			autoAlpha: 0
		});

		gsap.set(this.$counter, {
			autoAlpha: 0
		});

		gsap.effects.hideChars(this.$activeHeading, {
			x: 50,
			y: 0,
			duration: 0,
		});

		gsap.effects.hideChars(this.$activeSubheading, {
			x: 25,
			y: 0,
			duration: 0,
		});

		gsap.effects.hideLines(this.$activeDescription, {
			y: '100%',
			duration: 0
		});

		gsap.set(this.$activeButton, {
			y: 50,
			autoAlpha: 0
		});

		gsap.set(this.$activeBg, {
			scale: 1.1,
			autoAlpha: 0,
			transformOrigin: 'center center',
			transition: 'none'
		});
	}

	run() {
		const tl = new gsap.timeline(),
			from = getStaggerFrom(this.$activeSlide);

		tl
			.add([
				gsap.to(this.$canvasWrapper, {
					scale: 1,
					autoAlpha: 1,
					ease: 'power3.out',
					duration: 2.4,
					transformOrigin: 'center center'
				}),
				gsap.to(this.$activeBg, {
					scale: this.activeBgScale,
					autoAlpha: 1,
					ease: 'power3.out',
					duration: 2.4,
					transformOrigin: 'center center',
					transition: 'none',
					clearProps: 'transform'
				})
			])
			.animateChars(this.$activeHeading, {
				duration: 1.2,
				stagger: distributeByPosition({
					from: from === 'center' ? 'start' : from,
					amount: 0.4
				}),
				ease: 'power3.out',
			}, '-=2.0')
			.add([
				gsap.effects.animateChars(this.$activeSubheading, {
					duration: 1.2,
					stagger: distributeByPosition({
						from: from === 'center' ? 'start' : from,
						amount: 0.4
					}),
					ease: 'power3.out',
				}),
				gsap.effects.animateLines(this.$activeDescription, {
					duration: 1.2,
					ease: 'power3.out',
					stagger: {
						from: 'start',
						amount: 0.08
					}
				}),
				gsap.effects.animateLines(this.$slider.find('.slider__wrapper-button'), {
					excludeEl: '.js-change-text-hover__hover .split-text__line',
				})
			], '-=1.2')
			.to(this.$activeButton, {
				duration: 1.2,
				ease: 'power3.out',
				y: 0,
				autoAlpha: 1
			}, '-=1.2')
			.add([
				gsap.to(this.$footer, {
					duration: 1.2,
					autoAlpha: 1,
					y: '0%'
				}),
				gsap.to([this.$arrowLeft, this.$arrowRight, this.$counter], {
					autoAlpha: 1,
					duration: 1.2,
					x: '0%',
					y: '0%',
					stagger: 0.1,
				}),
			], '-=1.2')

		this._createScene({
			element: this.$el,
			timeline: tl
		});
	}
}
