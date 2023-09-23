class SectionTestimonials extends ScrollAnimation {
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
		this.$slider = this.$el.find('.js-slider-testimonials');
		this.slider = new SliderTestimonials({
			target: this.$slider,
			scope: this.scope
		});

		this.$activeSlide = this.$slider.find('.swiper-slide-active');
		this.$activeSign = this.$activeSlide.find('.figure-testimonial__sign');
		this.$activeDescription = this.$activeSlide.find('.slider-testimonials__text');

		gsap.set(this.$activeSign, {
			y: 50,
			autoAlpha: 0
		});

		gsap.effects.hideLines(this.$activeDescription, {
			y: '100%',
			duration: 0
		});
	}
	run() {
		const tl = new gsap.timeline();

		tl
			.add([
				gsap.to(this.$activeSign, {
					duration: 1.2,
					y: 0,
					autoAlpha: 1,
					ease: 'power3.out',
				}),
				gsap.effects.animateLines(this.$activeDescription, {
					duration: 1.2,
					ease: 'power3.out',
					delay: 0.2,
					stagger: {
						from: 'start',
						amount: 0.08
					}
				})
			]);

		this._createScene({
			element: this.$el,
			timeline: tl
		});
	}
}
