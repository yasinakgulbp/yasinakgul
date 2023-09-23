class Arrow extends BaseComponent {
	constructor({
		scope,
		target
	}) {
		super({
			target,
			scope
		});

	}

	run() {
		this._bindEvents();
	}

	set() {
		this.$circles = this.$target.find('.circle');
		this.initialSVGPath = '10% 90%';

		gsap.set(this.$circles, {
			clearProps: 'all',
		});

		gsap.set(this.$circles, {
			rotation: 180,
			drawSVG: this.initialSVGPath,
			transformOrigin: 'center center',
		});
	}

	_bindEvents() {
		const
			$circle = this.$el.find(this.$circles),
			tl = new gsap.timeline();

		this.$el
			.on('mouseenter touchstart', () => {
				tl
					.clear()
					.to($circle, {
						duration: 0.3,
						drawSVG: '0% 100%',
						rotation: 180,
						transformOrigin: 'center center'
					});
			})
			.on('mouseleave touchend', () => {
				tl
					.clear()
					.to($circle, {
						duration: 0.3,
						drawSVG: this.initialSVGPath,
						rotation: 180,
						transformOrigin: 'center center'
					});
			});
	}
}
