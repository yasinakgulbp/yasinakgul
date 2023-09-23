class SectionContent extends ScrollAnimation {
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
		this.$headline = this.$el.find('.section__headline');
		this.$trigger = this.$el.find('.section-content__inner');
		this.$button = this.$el.find('.section-content__button');
		this.$imageInner = this.$el.find('.section-content__image');
		this.$socialItems = this.$el.find('.social__item');

		gsap.set(this.$headline, {
			scaleX: 0
		});

		gsap.set(this.$button, {
			y: 30,
			autoAlpha: 0
		});

		gsap.set(this.$imageInner, {
			scaleY: 1.5,
			y: '33%',
			transformOrigin: 'top center',
			autoAlpha: 0,
		});

		gsap.set(this.$socialItems, {
			y: 30,
			autoAlpha: 0
		});
	}
	run() {
		const tl = new gsap.timeline();

		tl
			.animateWords(this.$el, {
				ease: 'power3.out',
				duration: 1.2,
				stagger: 0.04,
			}, 'start')
			.to(this.$socialItems, {
				y: 0,
				autoAlpha: 1,
				stagger: 0.05,
				duration: 0.6
			}, '<0.2')
			.animateLines(this.$el, {
				excludeEl: '.js-change-text-hover__hover .split-text__line',
				ease: 'power3.out',
				duration: 1.2,
				stagger: 0.06,
			}, '<0.2')
			.animateHeadline(this.$headline, 'start')
			.to(this.$button, {
				duration: 0.6,
				y: 0,
				autoAlpha: 1
			}, '<0.2');

		this._createScene({
			element: this.$el,
			timeline: tl,
			customTrigger: this.$trigger
		});

		if (this.$imageInner && this.$imageInner.length) {
			const tlImage = new gsap.timeline();

			tlImage.to(this.$imageInner, {
				duration: 0.9,
				autoAlpha: 1,
				y: '0%',
				force3D: true,
				scaleY: 1,
				ease: 'power3.out',
			});

			this._createScene({
				element: this.$imageInner,
				triggerHook: 1,
				reveal: false,
				timeline: tlImage,
			});
		}
	}
}
