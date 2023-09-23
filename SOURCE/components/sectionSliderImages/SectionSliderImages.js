class SectionSliderImages extends ScrollAnimation {
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
		this.$slider = this.$el.find('.js-slider-images');
		this.$slides = this.$slider.find('.swiper-slide');
		this.slider = new SliderImages({
			target: this.$slider,
			scope: this.scope
		});

		gsap.set(this.$slides, {
			x: '33%',
			autoAlpha: 0,
			transformOrigin: 'right center'
		});
	}
	run() {
		const tl = new gsap.timeline();

		tl.to(this.$slides, {
			duration: 1.2,
			autoAlpha: 1,
			x: '0%',
			force3D: true,
			stagger: 0.1,
			ease: 'power3.out',
		});

		this._createScene({
			element: this.$el,
			timeline: tl,
		});
	}
}
