class SectionList extends ScrollAnimation {
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
		// mouse trailing hover effect
		this.$listHoverContainer = this.$el.find('.js-list-hover');
		this.$listHoverLinks = this.$el.find('.js-list-hover__link');

		// albums thumbs hover reveal
		this.$listHoverThumbs = this.$el.find('.js-list-thumbs');
		this.$listHoverThumbsLinks = this.$el.find('.js-list-thumbs__link');

		this.$listItems = this.$el.find('.list-projects__item');
		this.$listImages = this.$el.find('.list-projects__cover img, .list-projects__thumbnail');
		this.$wrapperLinks = this.$el.find('.list-projects__wrapper-link');
		this.listHoverClass = 'list-projects_hover';
		this.canvas = this.$scope.find('.js-list-hover__canvas').get(0);
		this.listHoverOptions = {
			strength: this.$listHoverContainer.data('arts-hover-strength') || 0.0,
			scaleTexture: this.$listHoverContainer.data('arts-hover-scale-texture') || 1.8,
			scalePlane: this.$listHoverContainer.data('arts-hover-scale-plane') || 1.0
		};

		if (this.$listHoverContainer.length) {
			this._bindEventsHover();
			this._getHoverImagesEffect();

			// PJAX is active
			if (window.$barbaWrapper.length && !window.Modernizr.touchevents) {
				this._bindEventsClick();
			}
		}

		if (this.$listHoverThumbs.length) {
			this._bindEventsHover();
			this._bindEventsHoverCovers();
		}

		if (this._hasAnimationScene(this.$el)) {
			this._setAnimation();
			this._animate();
		}
	}

	_getHoverImagesEffect() {
		return new EffectStretch({
			target: this.$listHoverContainer,
			items: this.$listHoverLinks,
			canvas: this.canvas,
			options: this.listHoverOptions
		});
	}

	_bindEventsHover() {
		this.$listHoverLinks
			.on('mouseenter touchstart', () => {
				this.$listHoverContainer.addClass(this.listHoverClass);
			})
			.on('mouseleave touchend', () => {
				this.$listHoverContainer.removeClass(this.listHoverClass);
			});

		this.$listHoverThumbsLinks
			.on('mouseenter touchstart', () => {
				this.$listHoverThumbs.addClass(this.listHoverClass);
			})
			.on('mouseleave touchend', () => {
				this.$listHoverThumbs.removeClass(this.listHoverClass);
			});
	}

	_bindEventsClick() {
		const self = this;

		this.$listHoverLinks
			.on('click', function (e) {
				const $el = $(this),
					$img = $el.find('img'),
					$transformEl = $el.find('.js-transition-img__transformed-el'),
					aspect = $img[0].naturalWidth / $img[0].naturalHeight;

				let width, height;

				if (aspect > 1) { // landscape
					height = (window.innerHeight / 2 / aspect);
				} else { // portrait
					height = (window.innerHeight / 2 / (aspect + 1));
				}

				width = height * aspect;

				gsap.set($transformEl, {
					scale: Math.abs(self.listHoverOptions.scaleTexture + 0.05),
					transformOrigin: 'center center'
				});

				$el.data('coordinates', {
					top: e.clientY - height / 2, // mouse center Y
					left: e.clientX - width / 2, // mouse center X
					width,
					height,
				});
			});
	}

	_bindEventsHoverCovers() {
		const self = this;

		this.$listHoverThumbsLinks.each(function () {
			const
				$current = $(this),
				$covers = $(`.js-list-thumbs__cover[data-background-for="${$current.data('post-id')}"]`);

			$current
				.on('mouseenter touchstart', function () {
					$covers.each(function (index) {
						let
							$images = $(this).find('.list-projects__cover-wrapper'),
							offset = self._getRandomPosition(index, 20);

						gsap.to($images, {
							x: `${offset.x}%`,
							y: `${offset.y}%`,
							ease: 'power4.out',
							duration: 1.2,
							height: 'auto',
							stagger: 0.05
						});
					});
				})
				.on('mouseleave touchend', () => {
					gsap.to(self.$listHoverThumbs.find('.list-projects__cover-wrapper'), {
						ease: 'power4.out',
						duration: 1.2,
						height: 0,
						x: '0%',
						y: '0%'
					});
				});
		});
	}

	_getRandomPosition(index = 0, range = 20) {
		const res = [];

		switch (index) {
			case 0:
				res.x = gsap.utils.random(-range, 0);
				res.y = gsap.utils.random(-range, -range);
				break;
			case 1:
				res.x = gsap.utils.random(0, range);
				res.y = gsap.utils.random(-range, range);
				break;
			case 2:
				res.x = gsap.utils.random(-range, range);
				res.y = gsap.utils.random(-range, 0);
				break;
			default:
				res.x = gsap.utils.random(-range, range);
				res.y = gsap.utils.random(-range, range);
				break;
		}

		return res;
	}

	_setAnimation() {
		gsap.set(this.$listImages, {
			opacity: 0,
			scale: 1.1,
			transformOrigin: 'center center'
		});
	}

	_animate() {
		const self = this;

		self._createScene({
			element: this.$el
		});

		this.$listItems.each(function () {
			const
				$el = $(this),
				tl = new gsap.timeline(),
				$thumb = $el.find('.list-projects__cover img, .list-projects__thumbnail'),
				$heading = $el.find('.list-projects__heading'),
				offset = $thumb.is(':visible') ? '-=0.6' : '0';

			tl
				.to($thumb, {
					opacity: 1,
					scale: 1,
					duration: 1.2,
				})
				.add([
					gsap.effects.animateWords($heading, {
						duration: 0.9
					}),
					gsap.effects.animateLines($el, {
						excludeEl: '.js-change-text-hover__hover .split-text__line',
					})
				], offset);

			self._createScene({
				element: $el,
				timeline: tl,
				reveal: false
			});
		});
	}
}
