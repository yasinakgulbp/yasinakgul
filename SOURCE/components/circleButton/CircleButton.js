class CircleButton extends ScrollAnimation {
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
		this.$arcText = this.$el.find('.circle-button__label');
		this.$arcWrapper = this.$el.find('.circle-button__wrapper-label');
		this.arcTextElement = this.$arcText.get(0);
	}

	run() {
		if (this._hasAnimationScene(this.$el)) {
			this._createScene({
				element: this.$el,
				timeline: this._getSceneTimeline(),
				duration: window.innerHeight,
				reverse: true
			});
		}

		this.instance = this._createArcText();
		this.$el.addClass('js-circle-button_curved');
		this._setRadius();
		this._bindEvents();
	}

	_createArcText() {
		return new CircleType(this.arcTextElement);
	}

	_setRadius() {
		this.instance.radius(this.arcTextElement.offsetWidth / 2);
	}

	_bindEvents() {
		window.$window.on('resize', debounce(() => {
			this._setRadius();
		}, 250));
	}

	_getSceneTimeline() {
		return new gsap.timeline().fromTo(this.$arcWrapper, {
			rotation: 0,
			transformOrigin: 'center center'
		}, {
			duration: 1,
			rotation: 360,
		});
	}
}
