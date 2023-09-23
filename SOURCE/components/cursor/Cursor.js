class Cursor extends BaseComponent {
	constructor({
		scope,
		target,
		hideCursorNative = false,
		cursorElements,
		highlightElements,
		highlightScale = 1.3,
		magneticElements,
		magneticScale = 1,
		magneticScaleCursorBy = 'element',
		factorTrailing = 4,
		animDuration = 0.2,
		distanceArrows = 45,
	}) {
		super({
			target,
			scope
		});

		this.timeline = new gsap.timeline();
		this.timelineArrows = new gsap.timeline();
		this.$follower = this.$target.find('.cursor__follower');
		this.$inner = this.$target.find('#inner');
		this.$outer = this.$target.find('#outer');
		this.$arrowUp = this.$target.find('.cursor__arrow_up');
		this.$arrowDown = this.$target.find('.cursor__arrow_down');
		this.$arrowLeft = this.$target.find('.cursor__arrow_left');
		this.$arrowRight = this.$target.find('.cursor__arrow_right');
		this.$label = this.$target.find('.cursor__label');
		this.$icon = this.$target.find('.cursor__icon');
		this.offsetTop = parseInt(window.$html.css('marginTop'), 10);
		this.animDuration = animDuration;
		this.mouseX = window.mouseX || 0;
		this.mouseY = window.mouseY || 0;
		this.magneticX = 0;
		this.magneticY = 0;
		this.scale = 1;
		this.posX = 0;
		this.posY = 0;
		this.cursorCenterX = parseFloat(this.$target.innerWidth() / 2);
		this.cursorCenterY = parseFloat(this.$target.innerHeight() / 2);
		this.isFirstMove = true;
		this.cursorElements = cursorElements;
		this.highlightElements = highlightElements;
		this.highlightScale = highlightScale;
		this.magneticElements = magneticElements;
		this.$magneticElements = $(magneticElements);
		this.magneticScale = magneticScale;
		this.magneticScaleCursorBy = magneticScaleCursorBy;
		this.factorTrailing = factorTrailing;
		this.labels = window.theme.cursorFollower.labels;
		this.distanceArrows = distanceArrows;
		this.hideCursorNative = hideCursorNative;
		this.strokeColor = this.$inner.css('stroke');

		this._bindEvents();
	}

	set() {
		gsap.set(this.$target, {
			display: 'block',
		});
		gsap.to(this.$target, {
			duration: 0.6,
			scale: 1,
			autoAlpha: 1,
			xPercent: 0,
			yPercent: 0,
		});
	}

	run() {
		gsap.to({}, {
			duration: 0.01,
			repeat: -1,
			onRepeat: () => {
				const trailing = this.isFirstMove ? 1 : this.factorTrailing;
				this.posX += (this.mouseX - this.posX) / trailing;
				this.posY += (this.mouseY - this.posY - this.offsetTop) / trailing;

				gsap.set(this.$target, {
					xPercent: 0,
					yPercent: 0,
					x: this.posX - this.cursorCenterX,
					y: this.posY + this.offsetTop - this.cursorCenterY,
					repeat: -1,
				});
				this.isFirstMove = false;
			}
		});
	}

	_scaleCursor() {
		gsap.to(this.$follower, {
			duration: this.animDuration,
			scale: this.scale,
			overwrite: 'all'
		});
	}

	_highlightCursor(highlight = true) {
		gsap.to(this.$inner, {
			duration: this.animDuration,
			fill: highlight ? this.strokeColor : '',
			opacity: highlight ? 0.4 : '',
			overwrite: 'all'
		});
	}

	_bindEvents() {
		const self = this;

		this.$scope.off('mousemove mouseenter mouseleave')
			.on('mousemove', (e) => {
				this.mouseX = this.magneticX || e.clientX;
				this.mouseY = this.magneticY || e.clientY;
			})
			// slider dots
			.on('mouseenter', '.slider__dot', () => {
				this.setCursor({
					hide: true
				});
			})
			.on('mouseleave', '.slider__dot', (e) => {
				this.setCursor({
					hide: false
				});
				this.scale = 1;
				this._scaleCursor();
				this._resetMagnifiedElement($(e.currentTarget));
			})
			.on('mousemove', '.slider__dot', (e) => {
				const $target = $(e.currentTarget);

				this.scale = 0.5;
				this._scaleCursor();
				this._magnifyElement({
					element: $target,
					event: e,
					distance: self.magneticDistance,
					scaleBy: self.magneticScaleCursorBy,
					scale: 0.5,
				});
			})
			// social links
			.on('mouseenter', '.social__item', () => {
				this.setCursor({
					hide: true
				});
			})
			.on('mouseleave', '.social__item', (e) => {
				this.setCursor({
					hide: false
				});
				this.scale = 1;
				this._scaleCursor();
				this._resetMagnifiedElement($(e.currentTarget));
			})
			.on('mousemove', '.social__item', (e) => {
				const $target = $(e.currentTarget);

				this.scale = 0.8;
				this._scaleCursor();
				this._magnifyElement({
					element: $target,
					event: e,
					distance: self.magneticDistance,
					scaleBy: self.magneticScaleCursorBy,
					scale: 0.8,
				});
			})
			// PSWP gallery
			.on('mousemove', '.pswp--zoomed-in .pswp__img', (e) => {
				this.setCursor({
					hide: false
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this.scale = 1.0;
				this._scaleCursor();
			})
			.on('mousemove', '.pswp--dragging .pswp__img', (e) => {
				this.scale = 1.0;
				this._scaleCursor();
			})
			// cursor elements
			.on('mouseenter', self.cursorElements, (e) => {
				const $target = $(e.currentTarget);

				this.setCursor({
					hide: $target.data('arts-cursor-hide-native') || self.hideCursorNative
				});
				this._setLabel({
					label: $target.data('arts-cursor-label') || ''
				});
				this._setIcon({
					icon: $target.data('arts-cursor-icon') || ''
				});
				this._hideArrows();
				this.scale = parseFloat($target.data('arts-cursor-scale'));
				this._scaleCursor();
			})
			.on('mouseleave', self.cursorElements, () => {
				this.setCursor({
					hide: false
				});
				this._setLabel({
					label: '',
					hide: true
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this.scale = 1;
				this._scaleCursor();
			})
			// highlight elements
			.on('mouseenter', self.highlightElements, (e) => {
				this.scale = parseFloat(this.highlightScale);
				this._highlightCursor(true);
				this._scaleCursor();
			})
			.on('mouseleave', self.highlightElements, (e) => {
				this.scale = 1;
				this._highlightCursor(false);
				this._scaleCursor();
			})
			// magnetic elements
			.on('mousemove', self.magneticElements, (e) => {
				const $target = $(e.currentTarget);

				this._magnifyElement({
					element: $target,
					event: e,
					distance: self.magneticDistance,
					scaleBy: self.magneticScaleCursorBy,
					scale: parseFloat($target.data('arts-cursor-scale')) || this.magneticScale,
				});
			})
			.on('mouseleave', self.magneticElements, (e) => {
				this._resetMagnifiedElement($(e.currentTarget));
			})
			// slider dragging
			.on('arts/slider/touchDown', (e) => {
				this.setCursor({
					hide: true
				});
				this._setLabel({
					label: this.labels.slider
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this._revealArrows(e.detail);
				this.scale = 1.6;
				this._scaleCursor();
			})
			.on('arts/slider/touchUp', () => {
				this.setCursor({
					hide: false
				});
				this._setLabel({
					label: this.labels.slider,
					hide: true
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this._hideArrows();
				this.scale = 1;
				this._scaleCursor();
			})
			// pswp gallery pan
			.on('arts/pswp/touchDown', (e) => {
				this.setCursor({
					hide: false
				});
				this._setLabel({
					label: ''
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this._revealArrows(e.detail);
				this.scale = 1.0;
				this._scaleCursor();
			})
			.on('arts/pswp/touchUp arts/pswp/close', () => {
				this.setCursor({
					hide: false
				});
				this._setLabel({
					label: '',
					hide: true
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this._hideArrows();
				this.scale = 1;
				this._scaleCursor();
			})
			.on('arts/pswp/slideChange', (e) => {
				this._setLabel({
					label: '',
					hide: true
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this._hideArrows();
			});

		// reset cursor after AJAX transition
		window.$window
			.on('arts/barba/transition/end', () => {
				this.setCursor({
					hide: false
				});
				this._setLabel({
					label: '',
					hide: true
				});
				this._setIcon({
					icon: '',
					hide: true
				});
				this._hideArrows();
				this.scale = 1;
				this._scaleCursor();
				this._highlightCursor(false);
			});
	}

	_setLabel({
		label = '',
		hide = false
	}) {
		this.$label.html(label);
		if (hide === true) {
			gsap.to(this.$label, {
				duration: this.animDuration,
				autoAlpha: 0,
				y: -20,
			});
		} else {
			gsap.to(this.$label, {
				duration: this.animDuration,
				autoAlpha: 1,
				y: 0,
			});
		}
	}

	_setIcon({
		icon = '',
		hide = false
	}) {
		this.$icon.html(icon);
		if (hide === true) {
			gsap.to(this.$icon, {
				duration: this.animDuration,
				autoAlpha: 0,
				y: -20,
			});
		} else {
			gsap.to(this.$icon, {
				duration: this.animDuration,
				autoAlpha: 1,
				y: 0,
			});
		}
	}

	_revealArrows({
		direction = 'horizontal'
	}) {
		if (direction === 'horizontal') {
			this.timelineArrows
				.clear()
				.add([
					gsap.to(this.$arrowLeft, {
						duration: this.animDuration,
						autoAlpha: 1,
						x: -this.distanceArrows
					}),
					gsap.to(this.$arrowRight, {
						duration: this.animDuration,
						autoAlpha: 1,
						x: this.distanceArrows
					})
				]);
		}
		if (direction === 'vertical') {
			this.timelineArrows
				.clear()
				.add([
					gsap.to(this.$arrowUp, {
						duration: this.animDuration,
						autoAlpha: 1,
						y: -this.distanceArrows
					}),
					gsap.to(this.$arrowDown, {
						duration: this.animDuration,
						autoAlpha: 1,
						y: this.distanceArrows
					})
				]);
		}

		if (direction === 'all') {
			this.timelineArrows
				.clear()
				.add([
					gsap.to(this.$arrowUp, {
						duration: this.animDuration,
						autoAlpha: 1,
						y: -this.distanceArrows / 2
					}),
					gsap.to(this.$arrowDown, {
						duration: this.animDuration,
						autoAlpha: 1,
						y: this.distanceArrows / 2
					}),
					gsap.to(this.$arrowLeft, {
						duration: this.animDuration,
						autoAlpha: 1,
						x: -this.distanceArrows / 2
					}),
					gsap.to(this.$arrowRight, {
						duration: this.animDuration,
						autoAlpha: 1,
						x: this.distanceArrows / 2
					})
				]);
		}
	}

	_hideArrows() {
		this.timelineArrows
			.clear()
			.to([this.$arrowUp, this.$arrowDown, this.$arrowLeft, this.$arrowRight], {
				duration: this.animDuration,
				autoAlpha: 0,
				x: 0,
				y: 0
			});
	}

	_calcDistance({
		centerX,
		centerY,
		mouseX,
		mouseY
	}) {
		return Math.floor(
			Math.sqrt(
				Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
			)
		);
	}

	_resetMagnifiedElement(element) {
		this.magneticX = 0;
		this.magneticY = 0;

		if (element && element.length) {
			gsap.to(element, {
				duration: 0.4,
				y: 0,
				x: 0
			});
		}
	}

	_magnifyElement({
		element,
		event,
		distance,
		scale,
		scaleBy,
	}) {

		const {
			top,
			left,
			width,
			height
		} = element.get(0).getBoundingClientRect(),
			centerX = left + width / 2,
			centerY = top + height / 2,
			deltaX = Math.floor((centerX - event.clientX)) * -.5,
			deltaY = Math.floor((centerY - event.clientY)) * -.5;

		this.magneticX = centerX;
		this.magneticY = centerY;
		this.scale = scaleBy === 'element' ? Math.max(width, height) / this.cursorCenterX * scale : scaleBy * scale;

		gsap.to(element, {
			duration: 0.2,
			y: deltaY,
			x: deltaX,
			overwrite: 'all'
		});
	}

	setCursor({
		hide = false,
		loading = false
	}) {
		if (hide === true && !window.$body.hasClass('cursor-none')) {
			window.$body.addClass('cursor-none');
		} else {
			window.$body.removeClass('cursor-none');
		}

		if (loading === true && !window.$body.hasClass('cursor-progress')) {
			window.$body.addClass('cursor-progress');
		} else {
			window.$body.removeClass('cursor-progress');
		}
	}
}
