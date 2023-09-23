class Counter extends ScrollAnimation {
	constructor(options) {
		super(options);
		this.$num = this.$target.find('.js-counter__number');
		this.start = this.$target.data('counter-start') || 0;
		this.target = this.$target.data('counter-target') || 100;
		this.digits = this.target.toString().length;
		this.duration = this.$target.data('counter-duration') || 4;
		this.prefix = this.$target.data('counter-prefix') || '';
		this.suffix = this.$target.data('counter-suffix') || '';
		this.counter = {
			val: this.numberStart
		};
		this.prepare();
		this.animate();
	}

	prepare() {
		let value = parseFloat(this.start).toFixed(0);

		value = this.prefix + this._addZeros(value) + this.suffix;
		this.$num.text(value);
	}

	animate() {
		const tl = new gsap.timeline();
		let value;

		tl.to(this.counter, {
			duration: this.duration,
			val: parseFloat(this.target).toFixed(0),
			ease: 'power4.out',
			onUpdate: () => {
				value = parseFloat(this.counter.val).toFixed(0);
				value = this._addZeros(value);
				this.$num.text(this.prefix + value + this.suffix);
			}
		});

		this._createScene({
			element: this.$target,
			timeline: tl
		});
	}

	_addZeros(value) {
		while (value.toString().length < this.digits) {
			value = '0' + value;
		}

		return value;
	}
}
