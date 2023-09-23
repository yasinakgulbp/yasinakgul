class SliderCategories extends BaseComponent {
	constructor({
		target,
		scope,
		sliderContent,
		links,
		options
	}) {
		super({
			target,
			scope
		});

		this.sliderContent = sliderContent;

		// elements
		this.$links = links;
		this.$items = this.$target.find('[data-category]');
		this.$button = this.$target.find('[data-button]');

		// setup
		this.initialCategory = $(this.sliderContent.slides[this.sliderContent.realIndex]).data('category');
		this.$initialActiveItem = this.$target.find(`[data-category="${this.initialCategory}"]`);
		this.$slides = $(sliderContent.slides);
		this.timeline = new gsap.timeline();

		// options
		this.options = options || {
			duration: 0.4,
			ease: 'power4.out'
		};

		this._bindSliderEvents();
		this._bindHoverEvents();
		this._getTimelineShowItem(this.$initialActiveItem);

	}

	_bindSliderEvents() {
		this.sliderContent
			.on('slideChange', () => {
				const
					prevCategory = this.$slides.eq(this.sliderContent.previousIndex).data('category'),
					category = this.$slides.eq(this.sliderContent.realIndex).data('category'),
					$activeItem = this.$target.find(`[data-category="${category}"]`);

				if (!category.length) {
					this.timeline
						.clear()
						.hideLines(this.$items, {
							y: '100%',
							stagger: 0,
							duration: this.options.duration,
							ease: this.options.ease
						});
				}

				// don't animate if category of next current item is
				// the same as previous
				if ($activeItem.length && category !== prevCategory) {
					this.timeline.clear().add(this._getTimelineShowItem($activeItem));
				}

			});
	}

	_bindHoverEvents() {
		this.$links
			.on('mouseenter touchstart', () => {
				this.timeline.clear().add(this._getTimelineShowButton());
			})
			.on('mouseleave touchend', () => {

				const
					category = this.$slides.eq(this.sliderContent.realIndex).data('category'),
					$activeItem = this.$target.find(`[data-category="${category}"]`);

				if ($activeItem.length) {
					this.timeline.clear().add(this._getTimelineShowItem($activeItem));
				}
			});
	}

	_getTimelineShowButton() {
		return new gsap.timeline()
			.hideLines(this.$button, {
				y: '100%',
				duration: 0,
				stagger: 0
			})
			.add([
				gsap.effects.animateLines(this.$button, {
					duration: this.options.duration,
					stagger: 0,
					ease: this.options.ease
				}),
				gsap.effects.hideLines(this.$items, {
					y: '-100%',
					duration: this.options.duration,
					stagger: 0,
					ease: this.options.ease
				})
			]);
	}

	_getTimelineShowItem($activeItem) {
		return new gsap.timeline()
			.hideLines($activeItem, {
				y: '100%',
				duration: 0,
				stagger: 0
			})
			.add([
				gsap.effects.animateLines($activeItem, {
					duration: this.options.duration,
					stagger: 0,
					ease: this.options.ease
				}),
				gsap.effects.hideLines([this.$items.not($activeItem), this.$button], {
					y: '-100%',
					duration: this.options.duration,
					stagger: 0,
					ease: this.options.ease
				})
			]);
	}
}
