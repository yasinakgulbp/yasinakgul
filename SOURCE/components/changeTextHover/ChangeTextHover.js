class ChangeTextHover extends BaseComponent {
	constructor({
		target,
		scope,
		pageIndicator,
		triggers,
		options
	}) {
		super({
			target,
			scope
		});

		this.options = options || {
			duration: 0.4,
			ease: 'power4.out'
		};
		this.$pageIndicator = pageIndicator;
		this.$triggers = triggers;
		this._bindEvents();

		if (this.$pageIndicator.length) {
			this._bindEventsHoverIndicator();
		}
	}

	_bindEvents() {
		const self = this;

		this.$target
			.on('mouseenter touchstart', function () {
				const
					$el = $(this),
					$normalText = $el.find('.js-change-text-hover__normal'),
					$hoverText = $el.find('.js-change-text-hover__hover'),
					$hoverLine = $el.find('.js-change-text-hover__line');

				self._getTimelineShowHover({
					normal: $normalText,
					hover: $hoverText,
					line: $hoverLine
				});
			})
			.on('mouseleave touchend', function () {
				const
					$el = $(this),
					$normalText = $el.find('.js-change-text-hover__normal'),
					$hoverText = $el.find('.js-change-text-hover__hover'),
					$hoverLine = $el.find('.js-change-text-hover__line');

				self._getTimelineHideHover({
					normal: $normalText,
					hover: $hoverText,
					line: $hoverLine
				});
			});
	}

	_bindEventsHoverIndicator() {
		const
			$normalText = this.$pageIndicator.find('.js-change-text-hover__normal'),
			$hoverText = this.$pageIndicator.find('.js-change-text-hover__hover'),
			$hoverLine = this.$pageIndicator.find('.js-change-text-hover__line');

		this.$triggers
			.on('mouseenter touchstart', () => {
				this._getTimelineShowHover({
					normal: $normalText,
					hover: $hoverText,
					line: $hoverLine
				});
			})
			.on('mouseleave touchend', () => {
				this._getTimelineHideHover({
					normal: $normalText,
					hover: $hoverText,
					line: $hoverLine
				});
			});

		// initial set
		this._getTimelineHideHover({
			normal: $normalText,
			hover: $hoverText,
			line: $hoverLine
		});
	}

	_getTimelineShowHover({
		normal,
		hover,
		line
	}) {
		return new gsap.timeline({
				delay: 0.02
			})
			.hideLines(hover, {
				y: '100%',
				duration: 0,
				stagger: 0
			})
			.add([
				gsap.effects.animateLines(hover, {
					ease: this.options.ease,
					duration: this.options.duration,
					stagger: 0
				}),
				gsap.effects.hideLines(normal, {
					y: '-100%',
					ease: this.options.ease,
					duration: this.options.duration,
					stagger: 0
				}),
				gsap.to(line, {
					ease: this.options.ease,
					scaleX: 1,
					transformOrigin: 'left center',
					duration: this.options.duration
				})
			]);
	}

	_getTimelineHideHover({
		normal,
		hover,
		line
	}) {
		return new gsap.timeline({
				delay: 0.02
			})
			.hideLines(normal, {
				y: '100%',
				duration: 0,
				stagger: 0
			})
			.add([
				gsap.effects.animateLines(normal, {
					ease: this.options.ease,
					duration: this.options.duration,
					stagger: 0
				}),
				gsap.effects.hideLines(hover, {
					y: '-100%',
					ease: this.options.ease,
					duration: this.options.duration,
					stagger: 0
				}),
				gsap.to(line, {
					ease: this.options.ease,
					scaleX: 0,
					transformOrigin: 'right center',
					duration: this.options.duration
				})
			]);
	}
}
