class SectionMasthead extends ScrollAnimation {
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
		this._fixedMasthead();
		if (this._hasAnimationScene(this.$el)) {
			this.setAnimation();
			this.animate();
		}
	}

	_fixedMasthead() {
		const
			$fixedMasthead = this.$el.filter('.section-masthead_fixed');

		if ($fixedMasthead.length) {
			const tl = new gsap.timeline();

			tl.fromTo($fixedMasthead, {
				autoAlpha: 1
			}, {
				autoAlpha: 0,
			});

			new $.ScrollMagic.Scene({
					triggerElement: $fixedMasthead.next(),
					triggerHook: 'onEnter',
					reverse: true,
					duration: window.innerHeight / 2
				})
				.setTween(tl)
				.setPin($fixedMasthead, {
					pushFollowers: false
				})
				.addTo(window.SMController);
		}
	}

	setAnimation() {
		this.$subheading = this.$el.find('.section-masthead__subheading');
		this.$heading = this.$el.find('.section-masthead__heading');
		this.$text = this.$el.find('.section-masthead__text');
		this.$bgWrapper = this.$el.find('.section-image__wrapper');
		this.$itemsMeta = this.$el.find('.section-masthead__meta-item');
		this.$headline = this.$el.find('.section__headline');
		this.$background = this.$el.find('.section-masthead__background:not(.js-cancel-animation)').find('.section-image__wrapper .lazy-bg');
		this.$bg = this.$el.find('.section-masthead__bg');
		this.$wrapperbutton = this.$el.find('.section-masthead__wrapper-button');
		this.$wrapperSD = this.$el.find('.section-masthead__wrapper-scroll-down');
		this.$overlay = this.$el.find('.section-masthead__background.js-cancel-animation').find('.section-masthead__overlay');

		gsap.set(this.$background, {
			scale: 1.05,
			transformOrigin: 'center center',
			autoAlpha: 0
		});

		gsap.set(this.$itemsMeta, {
			y: '100%',
			autoAlpha: 0
		});

		gsap.set(this.$bg, {
			scaleY: 0,
			transformOrigin: 'bottom center'
		});

		gsap.set(this.$overlay, {
			autoAlpha: 0
		});

		gsap.set(this.$headline, {
			scaleX: 0
		});

		gsap.set(this.$wrapperbutton, {
			y: 30,
			autoAlpha: 0
		});

		gsap.set(this.$wrapperSD, {
			y: 30,
			autoAlpha: 0
		});

		gsap.effects.hideChars(this.$el, {
			x: 0,
			y: '100%',
			autoAlpha: 1,
			duration: 0,
		});
	}

	animate() {
		const
			tl = new gsap.timeline(),
			$target = this.$el.filter('[data-arts-os-animation]'),
			from = getStaggerFrom($target);

		tl.to(this.$itemsMeta, {
			stagger: 0.2,
			duration: 0.6,
			autoAlpha: 1,
			y: '0%'
		}, 'start');

		if (this.$bg.length && this.$background.length) {
			tl.to(this.$bg, {
					duration: 1.2,
					scaleY: 1,
					ease: 'expo.inOut'
				}, 'start')
				.to(this.$background, {
					duration: 2.4,
					autoAlpha: 1,
					scale: 1
				}, '-=0.4');
		}

		if (this.$bg.length && !this.$background.length) {
			tl.to(this.$bg, {
				duration: 1.2,
				scaleY: 1,
				ease: 'expo.inOut'
			}, 'start');
		}

		if (!this.$bg.length && this.$background.length) {
			tl
				.to(this.$background, {
					duration: 2.4,
					autoAlpha: 1,
					scale: 1
				}, '<0.2');
		}

		if (this.$overlay.length) {
			tl.to(this.$overlay, {
				autoAlpha: 1,
				duration: 1.2
			}, '<0.2');
		}

		tl.animateChars($target, {
			duration: 1.2,
			stagger: distributeByPosition({
				from: from === 'center' ? 'start' : from,
				amount: 0.2
			})
		}, '<0.2');

		tl.animateWords($target, {
				ease: 'power3.out',
				duration: 1.2
			}, '<0.2')
			.animateLines($target, {
				ease: 'power3.out',
				duration: 1.2,
				stagger: 0.06,
			}, '<0.2')
			.to(this.$wrapperbutton, {
				duration: 0.6,
				y: 0,
				autoAlpha: 1
			}, '<0.2')
			.to(this.$wrapperSD, {
				duration: 0.6,
				y: 0,
				autoAlpha: 1
			}, '<0.2')
			.animateHeadline(this.$headline, {
				duration: 0.6
			}, '<0.2');

		this._createScene({
			element: $target,
			timeline: tl
		});
	}
}
