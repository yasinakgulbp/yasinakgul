class SliderDistortionEffect extends BaseComponent {
	constructor({
		scope,
		target,
		slider,
		intensity,
		aspectRatio = 1.5,
		canvasWrapper,
		canvas,
		displacementImage
	}) {
		super({
			scope,
			target
		});

		if (!this._isThreeLoaded()) {
			return false;
		}

		this.slider = slider;
		this.speed = parseFloat(slider.params.speed / 1000);
		this.intensity = intensity;
		this.aspectRatio = aspectRatio;
		this.timeline = new gsap.timeline();

		this.$wrapper = this.slider.$wrapperEl;
		this.$canvasWrapper = canvasWrapper;
		this.canvas = canvas.get(0);
		this.displacementImg = displacementImage;

		this.distortionEffect = this._getEffect();
		this._setSlider();
		this._bindEvents();
		this._hideSlider();
	}

	_setSlider() {
		this.slider.params.effect = 'fade';
		this.slider.params.fadeEffect.crossFade = true;
		this.slider.params.touchRatio = 4;
		this.slider.params.preventInteractionOnTransition = true;

		if (this.slider.params.mousewheel.enabled) {
			this.slider.mousewheel.disable();
		}

		if (this.slider.params.keyboard.enabled) {
			this.slider.keyboard.disable();
		}
	}

	_bindEvents() {
		this.slider.on('slideChange', () => {
			this.distortionEffect.change({
				from: this.slider.previousIndex,
				to: this.slider.realIndex,
				speed: this.speed,
				intensity: this.slider.realIndex < this.slider.previousIndex ? -this.intensity : this.intensity,
				ease: 'power2.inOut'
			});

			this.timeline
				.clear()
				.to(this.$canvasWrapper, {
					duration: this.speed,
					scale: 1.05,
					transformOrigin: 'center center',
					ease: 'power2.out'
				})
				.to(this.$canvasWrapper, {
					duration: this.speed * 2,
					scale: 1,
				});
		});
	}

	_isThreeLoaded() {
		return (typeof window.THREE === 'object');
	}

	_getImagesSources() {
		const sources = [];

		this.$target.find('.slider__bg').each(function () {
			let path = $(this).attr('data-background');

			// video poster
			if (!path) {
				path = $(this).attr('poster');
			}

			sources.push(path);
		});

		return sources;
	}

	_getEffect() {
		return new EffectDistortion({
			slider: this.slider,
			canvas: this.canvas,
			aspect: this.aspectRatio,
			displacementImage: this.displacementImg,
			items: $(this.slider.slides)
		});
	}

	_hideSlider() {
		if (typeof window.elementor !== 'undefined') {
			gsap.set(this.$wrapper, {
				display: 'none'
			});
		} else {
			gsap.set(this.$wrapper, {
				autoAlpha: 0
			});
		}
	}

}
