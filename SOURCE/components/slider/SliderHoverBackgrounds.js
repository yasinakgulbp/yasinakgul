class SliderHoverBackgrounds extends BaseComponent {
	constructor({
		target,
		scope,
		sliderImg,
		images,
		links,
		hoverClass
	}) {
		super({
			scope,
			target
		});

		this.$images = images;
		this.$links = links;
		this.hoverClass = hoverClass;

		if (!this.$links.length) {
			return false;
		}

		this._bindHoverEvents();
	}

	_bindHoverEvents() {
		const self = this;

		this.$links.each(function () {
			$(this)
				.on('mouseenter touchstart', () => {
					self.$target.addClass(self.hoverClass);
				})
				.on('mouseleave touchend', () => {
					self.$target.removeClass(self.hoverClass);
				});
		});
	}
}
