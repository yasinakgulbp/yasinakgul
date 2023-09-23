class SliderTextTransitions {
	constructor({
		slider,
		direction,
		offset = 40,
		staggerHeadings = 0.3,
		staggerTexts = 0.2,
		heading,
		subheading,
		description,
		link
	}) {
		// slider
		this.slider = slider;
		this.$slides = $(this.slider.slides);

		// params
		this.offset = offset;
		this.direction = direction || this.slider.params.direction;
		this.speed = parseFloat(this.slider.params.speed / 1000);

		// elements
		this.$heading = heading;
		this.$subheading = subheading;
		this.$description = description;
		this.$link = link;
		this.elementsLength = this._countExistentElements();

		// animation
		this.timeline = new gsap.timeline();
		this.hideTimeline = new gsap.timeline();
		this.ease = 'power4.out';
		this.staggerHeadings = staggerHeadings;
		this.staggerTexts = staggerTexts;
		this.animationDirections = this._getAnimationDirections();
		this._initialSet();
		this._bindEvents();
	}

	_countExistentElements() {
		let length = 0;

		(this.$heading && this.$heading.length) ? length++ : '';
		(this.$subheading && this.$subheading.length) ? length++ : '';
		(this.$description && this.$description.length) ? length++ : '';
		(this.$link && this.$link.length) ? length++ : '';

		return length;
	}

	_bindEvents() {
		this.slider.on('slideChange', () => {
			if (this.slider.realIndex > this.slider.previousIndex) {
				this._slideChangeTransition({
					direction: 'next'
				});
			}

			if (this.slider.realIndex < this.slider.previousIndex) {
				this._slideChangeTransition({
					direction: 'prev'
				});
			}
		});
	}

	_initialSet() {
		const directions = this._getSlideAnimationDirections({
			direction: 'next'
		});

		if (this.$subheading && this.$subheading.length) {
			SetText.setChars({
				target: this.$subheading.not(this.$subheading.eq(0)),
				x: directions.in.x / 4,
				y: directions.in.y / 4,
			});
		}

		if (this.$heading && this.$heading.length) {
			SetText.setChars({
				target: this.$heading.not(this.$heading.eq(0)),
				x: directions.in.x,
				y: directions.in.y,
			});
		}

		if (this.$description && this.$description.length) {
			SetText.setLines({
				target: this.$description.not(this.$description.eq(0)),
				autoAlpha: 1,
				y: '100%',
			});
		}

		if (this.$link && this.$link.length) {
			gsap.set(this.$link.not(this.$link.eq(0)), {
				y: (this.animationDirections.offset.y.next.in || this.animationDirections.offset.x.next.in) / 2,
				autoAlpha: 0,
			});
		}
	}

	_slideChangeTransition({
		direction = 'next'
	}) {
		const
			self = this,
			directions = this._getSlideAnimationDirections({
				direction
			}),
			$prevSlide = this.$slides.eq(this.slider.previousIndex),
			$prevHeading = $prevSlide.find(this.$heading),
			$prevSubheading = $prevSlide.find(this.$subheading),
			$prevDescription = $prevSlide.find(this.$description),
			$prevLink = $prevSlide.find(this.$link),
			$activeSlide = this.$slides.eq(this.slider.realIndex),
			$activeHeading = $activeSlide.find(this.$heading),
			$activeSubheading = $activeSlide.find(this.$subheading),
			$activeDescription = $activeSlide.find(this.$description),
			$activeLink = $activeSlide.find(this.$link);

		this.timeline.clear();

		/**
		 * Animate out previous elements
		 * and set current elements
		 */
		if (this.$subheading && this.$subheading.length) {
			self.timeline.add([
				gsap.effects.hideChars(this.$subheading.not($activeSubheading), {
					duration: self.speed / 2,
					x: directions.out.x / 4,
					y: directions.out.y / 4,
					stagger: distributeByPosition({
						amount: self.staggerHeadings,
						from: directions.out.from
					}),
					ease: self.ease
				}),
				gsap.effects.hideChars($activeSubheading, {
					duration: 0,
					x: directions.in.x / 4,
					y: directions.in.y / 4,
				})
			], '0')
		}

		if (this.$heading && this.$heading.length) {
			self.timeline.add([
				gsap.effects.hideChars(this.$heading.not($activeHeading), {
					duration: self.speed,
					x: directions.out.x,
					y: directions.out.y,
					stagger: distributeByPosition({
						amount: self.staggerHeadings,
						from: directions.out.from
					}),
					ease: self.ease
				}),
				gsap.effects.hideChars($activeHeading, {
					duration: 0,
					x: directions.in.x,
					y: directions.in.y,
				})
			], '0');
		}

		if (this.$description && this.$description.length) {
			self.timeline.add([
				gsap.effects.hideLines(this.$description.not($activeDescription), {
					duration: self.speed,
					y: direction === 'next' ? '-100%' : '100%',
					stagger: distributeByPosition({
						from: direction === 'next' ? 'start' : 'end',
						amount: self.staggerTexts
					}),
					ease: self.ease,
				}),
				gsap.effects.hideLines($activeDescription, {
					duration: 0,
					y: direction === 'next' ? '100%' : '-100%',
				}),
			], '0')
		}

		if ($prevLink.length) {
			self.timeline.to($prevLink, {
				duration: self.speed,
				y: (self.animationDirections.offset.y.next.out || self.animationDirections.offset.x.next.out) / -2,
				autoAlpha: 0,
				ease: self.ease
			}, '0');
		}

		/**
		 * Set current elements
		 */

		if ($activeLink.length) {
			self.timeline.set($activeLink, {
				y: (self.animationDirections.offset.y.next.in || self.animationDirections.offset.x.next.in) / 2,
				autoAlpha: 0,
				ease: self.ease,
			}, '0');
		}

		/**
		 * All current elements are set
		 */
		self.timeline.addLabel('elementsSet');

		/**
		 * Animate in current elements
		 */
		if ($activeSubheading.length) {
			self.timeline.animateChars($activeSubheading, {
				duration: self.speed,
				stagger: distributeByPosition({
					amount: self.staggerHeadings,
					from: directions.in.from,
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeHeading.length) {
			self.timeline.animateChars($activeHeading, {
				duration: self.speed,
				stagger: distributeByPosition({
					amount: self.staggerHeadings,
					from: directions.in.from,
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeDescription.length) {
			self.timeline.animateLines($activeDescription, {
				duration: self.speed,
				autoAlpha: 1,
				stagger: distributeByPosition({
					amount: self.staggerTexts,
					from: direction === 'next' ? 'start' : 'end',
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeLink.length) {
			self.timeline.to($activeLink, {
				duration: self.speed,
				y: 0,
				autoAlpha: 1,
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		this.timeline.timeScale(this.speed);

	}

	_getSlideAnimationDirections({
		direction = 'next'
	}) {
		const
			directions = {
				in: {
					x: 0,
					y: 0,
					from: 'start'
				},
				out: {
					x: 0,
					y: 0,
					from: 'start'
				},
			};
		if (direction === 'next') {
			// next in
			directions.in.x = this.animationDirections.offset.x.next.in;
			directions.in.y = this.animationDirections.offset.y.next.in;
			directions.in.from = this.animationDirections.from.next.in;

			// next out
			directions.out.x = this.animationDirections.offset.x.next.out;
			directions.out.y = this.animationDirections.offset.y.next.out;
			directions.out.from = this.animationDirections.from.next.out;
		}

		if (direction === 'prev') {
			// prev in
			directions.in.x = this.animationDirections.offset.x.prev.in;
			directions.in.y = this.animationDirections.offset.y.prev.in;
			directions.in.from = this.animationDirections.from.prev.in;

			// prev out
			directions.out.x = this.animationDirections.offset.x.prev.out;
			directions.out.y = this.animationDirections.offset.y.prev.out;
			directions.out.from = this.animationDirections.from.prev.out;
		}

		return directions;
	}

	_getAnimationDirections() {
		const textAlign = this.$heading ? this.$heading.css('text-align') : 'left';

		const directions = {
			offset: {
				x: {
					next: {
						in: 0,
						out: 0
					},
					prev: {
						in: 0,
						out: 0
					},
				},
				y: {
					next: {
						in: 0,
						out: 0
					},
					prev: {
						in: 0,
						out: 0
					},
				},
			},
			from: {
				next: {
					in: 'start',
					out: 'start'
				},
				prev: {
					in: 'end',
					out: 'end'
				},
			}
		};

		switch (textAlign) {
			case 'left':
				// text align left & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = this.offset;
					directions.offset.x.next.out = -this.offset;
					directions.offset.x.prev.in = -this.offset;
					directions.offset.x.prev.out = this.offset;

					directions.from.next.in = 'start';
					directions.from.next.out = 'start';
					directions.from.prev.in = 'end';
					directions.from.prev.out = 'end';
				}
				// text align left & slider vertical
				if (this.direction === 'vertical') {
					directions.offset.y.next.in = this.offset;
					directions.offset.y.next.out = -this.offset;
					directions.offset.y.prev.in = -this.offset;
					directions.offset.y.prev.out = this.offset;

					directions.from.next.in = 'end';
					directions.from.next.out = 'start';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'end';
				}
				break;
			case 'center':
				// text align center & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = -this.offset;
					directions.offset.x.next.out = this.offset;
					directions.offset.x.prev.in = this.offset;
					directions.offset.x.prev.out = -this.offset;

					directions.from.next.in = 'end';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'start';
				}
				// text align left & slider vertical
				if (this.direction === 'vertical') {
					directions.offset.y.next.in = this.offset;
					directions.offset.y.next.out = -this.offset;
					directions.offset.y.prev.in = -this.offset;
					directions.offset.y.prev.out = this.offset;

					directions.from.next.in = 'center';
					directions.from.next.out = 'center';
					directions.from.prev.in = 'center';
					directions.from.prev.out = 'center';
				}
				break;
			case 'right':
				// text align right & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = -this.offset;
					directions.offset.x.next.out = this.offset;
					directions.offset.x.prev.in = this.offset;
					directions.offset.x.prev.out = -this.offset;

					directions.from.next.in = 'end';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'start';
				}
				// text align right & slider vertical
				if (this.direction === 'vertical') {

					directions.offset.y.next.in = -this.offset;
					directions.offset.y.next.out = this.offset;
					directions.offset.y.prev.in = this.offset;
					directions.offset.y.prev.out = -this.offset;

					directions.from.next.in = 'start';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'end';
					directions.from.prev.out = 'start';
				}
				break;
		}

		return directions;
	}
}
