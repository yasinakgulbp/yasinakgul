class Magnetic extends BaseComponent {
	constructor({
		scope,
		target,
		distance
	}) {
		super({
			target,
			scope
		});
		this.defaultDistance = 40;
		this.distance = distance || this.defaultDistance;
	}

	run() {
		this._bindEvents();
	}

	_bindEvents() {
		const self = this;

		this.$scope.on('mousemove', (event) => {
			this.$target.each(function () {
				const $el = $(this);

				self._magnifyElement({
					element: $el,
					event,
					distance: $el.data('arts-magnetic-distance') || self.distance
				});
			});
		});
	}

	_magnifyElement({
		element,
		event,
		distance
	}) {

		const
			centerX = element.offset().left + element.width() / 2,
			centerY = element.offset().top + element.height() / 2,
			deltaX = Math.floor((centerX - event.pageX)) * -.5,
			deltaY = Math.floor((centerY - event.pageY)) * -.5,
			targetDistance = this._calcDistance({
				element: element,
				mouseX: event.pageX,
				mouseY: event.pageY
			});

		if (targetDistance < distance) {
			gsap.to(element, {
				duration: 0.3,
				y: deltaY,
				x: deltaX
			});
		} else {
			gsap.to(element, {
				duration: 0.3,
				y: 0,
				x: 0
			});
		}

	}

	_calcDistance({
		element,
		mouseX,
		mouseY
	}) {
		return Math.floor(Math.sqrt(Math.pow(mouseX - (element.offset().left + (element.width() / 2)), 2) + Math.pow(mouseY - (element.offset().top + (element.height() / 2)), 2)));
	}
}
