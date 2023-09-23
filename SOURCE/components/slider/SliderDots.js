class SliderDots {
	constructor({
		slider,
		container
	}) {
		this.slider = slider;
		this.$container = container;
		this.$dots = this.$container.find('.slider__dot');
		this.delay = this.slider.params.autoplay.enabled ? parseFloat(this.slider.params.autoplay.delay / 1000) : parseFloat(this.slider.params.speed / 1000 / 2);
		this.timeline = new gsap.timeline();
		this.initialSetTimeline = new gsap.timeline();

		if (!this.$dots.length) {
			return false;
		}

		this.run();
	}

	run() {
		this._renderDots();
		this._prepare();
		this._bindEvents();
	}

	_renderDots() {
		this.$dots.append(this._getDotTemplate());
		this.$circles = this.$dots.find('.circle');
	}

	_prepare() {
		gsap.set(this.$circles, {
			strokeOpacity: 0,
			transformOrigin: 'center center',
			rotate: 180,
			drawSVG: '100% 100%',
		});

		const
			$currentDot = this.$dots.eq(0),
			$currentCircle = $currentDot.find('.circle');

		this.initialSetTimeline.fromTo($currentCircle, {
			strokeOpacity: 1,
			rotate: 0,
			transformOrigin: 'center center',
			drawSVG: '100% 100%',
			ease: 'power3.inOut',
		}, {
			strokeOpacity: 1,
			rotate: 180,
			transformOrigin: 'center center',
			duration: this.delay,
			drawSVG: '0% 100%',
		});
	}

	_bindEvents() {
		this.slider
			.on('autoplayStop', () => {
				this.timeline.pause();
			})
			.on('autoplayStart', () => {
				this.timeline.play();
			})
			.on('transitionStart', () => {
				this._setCurrentDot(this.slider.realIndex);
			});
	}

	_setCurrentDot(index = 0) {
		const
			$currentDot = this.$dots.eq(index),
			$currentCircle = $currentDot.find('.circle'),
			$otherCircles = this.$circles.not($currentCircle);

		this.timeline
			.clear()
			.add(() => {
				if (this.initialSetTimeline) {
					this.initialSetTimeline.kill();
				}
			})
			.to($otherCircles, {
				duration: this.delay / 10,
				transformOrigin: 'center center',
				drawSVG: '0% 0%',
				ease: 'expo.inOut',
			})
			.set($otherCircles, {
				strokeOpacity: 0,
			})
			.fromTo($currentCircle, {
				strokeOpacity: 1,
				rotate: 0,
				transformOrigin: 'center center',
				drawSVG: '100% 100%',
				ease: 'power3.inOut',
			}, {
				strokeOpacity: 1,
				rotate: 180,
				transformOrigin: 'center center',
				duration: this.delay,
				drawSVG: '0% 100%',
			});
	}

	_getDotTemplate() {
		return `
			<svg viewBox="0 0 152 152" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g fill="none" fill-rule="evenodd"><g transform="translate(-134.000000, -98.000000)">
					<path class="circle" d="M135,174a75,75 0 1,0 150,0a75,75 0 1,0 -150,0"></path>
				</g>
			</svg>
		`;
	}
}
