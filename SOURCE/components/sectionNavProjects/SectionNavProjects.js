class SectionNavProjects extends ScrollAnimation {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
		this.isClickedNext = false;
	}

	set() {
		this.$container = this.$el.find('.section-nav-projects__inner_actual');
		this.$circleButton = this.$el.find('.js-circle-button');
		this.$arcWrapper = this.$el.find('.circle-button__wrapper-label');
		this.$wrapperScroll = this.$el.find('.section-nav-projects__wrapper-scroll-down');
		this.$linkNext = this.$el.find('.section-nav-projects__link');
		this.$header = this.$el.find('.section-nav-projects__header');
		this.$subheading = this.$el.find('.section-nav-projects__subheading');
		this.$heading = this.$el.find('.section-nav-projects__heading');
		this.$nextImage = this.$el.find('.section-nav-projects__next-image');
		this.nextURL = this.$linkNext.attr('href');
		this.scene = null;
		this.scenePrefetch = null;

		this._setMeasures();
	}

	run() {
		if (this._hasAnimationScene(this.$el)) {

			if (window.theme.ajax.enabled) {
				this.scenePrefetch = this._createScene({
					element: this.$el,
					reveal: false,
					reverse: false,
					triggerHook: 'onEnter'
				}).on('start', () => {
					barba.prefetch(this.nextURL);
				});
			}

			this.scene = this._getScene();
			this._bindEvents();

			window.$window.on('resize', debounce(() => {
				this._setMeasures();
				this._bindEvents();
				window.SMController.removeScene(this.scene);
				this.scene = this._getScene();
			}, 500));
		}

	}

	_setMeasures() {
		this.elHeight = this.$container.height();
		this.offsetTop = this.$el.offset().top;
		this.sceneDuration = window.innerHeight;
	}

	_getScene() {
		return this._createScene({
			element: this.$el,
			timeline: this._getSceneTimeline(),
			duration: this.sceneDuration,
			reverse: true,
			triggerHook: 'onLeave'
		});
	}

	_bindEvents() {

		$(this.$circleButton).add(this.$header).off('click').on('click', (e) => {
			if (window.theme.ajax.enabled) {
				e.preventDefault();
				let offset = 0;

				if (typeof window.SB !== 'undefined') {
					offset = window.SB.limit.y + this.elHeight;
				} else {
					offset = document.body.scrollHeight - this.elHeight;
				}
				Scroll.scrollTo({
					x: 0,
					y: offset,
					duration: 1200
				});
			} else {
				this.$linkNext.get(0).click();
			}
		});
	}

	_getSceneTimeline() {
		const tl = new gsap.timeline({
			onStart: () => {
				this.scene.update(true);
				this.offsetTop = $(this.$el).offset().top;
			},
			onComplete: () => {
				if (!this.isClickedNext) {
					this.isClickedNext = true;
					window.SMController.removeScene(this.scene);
					window.SMController.removeScene(this.scenePrefetch);
					this.$linkNext.get(0).click();
				}
			},
			onUpdate: () => {
				this.scene.update(true);
				if (tl.progress() > 0.95) {
					tl.eventCallback('onUpdate', null);
					tl.progress(1);
				}
			}
		});

		tl
			.to(this.$container, {
				y: () => (window.pageYOffset - this.offsetTop + this.sceneDuration),
				duration: 1,
				ease: 'none',
			}, 'start')
			.fromTo(this.$header, {
				pointerEvents: 'initial',
				autoAlpha: 1,
				y: 0,
			}, {
				pointerEvents: 'none',
				duration: 0.75,
				autoAlpha: 0,
				y: -50,
				ease: 'linear.none',
			}, 'start')
			.fromTo(this.$nextImage, {
				ease: 'linear.none',
				autoAlpha: .1,
			}, {
				autoAlpha: 1,
				duration: 1,
				y: () => (window.pageYOffset - this.offsetTop),
			}, 'start')
			.fromTo(this.$arcWrapper, {
				rotation: 0,
				transformOrigin: 'center center'
			}, {
				duration: 1,
				rotation: 720,
			}, 'start')
			.to(this.$wrapperScroll, {
				y: -200,
				autoAlpha: 0,
				duration: 1,
			}, 'start');

		return tl;
	}
}
