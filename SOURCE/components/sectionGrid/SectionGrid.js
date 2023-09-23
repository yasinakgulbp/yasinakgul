class SectionGrid extends ScrollAnimation {
	constructor({
		scope,
		target
	}) {
		super({
			scope,
			target
		});
	}

	set() {

		this.$items = this.$el.find('.section-grid__item');
		this.$filter = this.$el.find('.js-filter');
		this.$filterUnderline = this.$filter.find('.filter__underline');
		this.$grid = this.$el.find('.js-grid');

		gsap.set(this.$items, {
			scaleY: 1.5,
			y: '33%',
			transformOrigin: 'top center',
			autoAlpha: 0,
		});

		gsap.set(this.$el, {
			autoAlpha: 1
		});

		gsap.set(this.$filterUnderline, {
			autoAlpha: 1
		});

		this._bindGridFilter();
	}

	run() {
		const
			masterTL = new gsap.timeline(),
			colsDesktop = parseInt(this.$el.data('grid-columns'), 10) || 1,
			colsTablet = parseInt(this.$el.data('grid-columns-tablet'), 10) || 1,
			colsMobile = parseInt(this.$el.data('grid-columns-mobile'), 10) || 1,
			lg = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.lg - 1 : 1024,
			md = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.md - 1 : 767;

		let cols = colsDesktop;

		masterTL.to(this.$filterUnderline, {
			autoAlpha: 1,
			duration: 1.2,
			ease: 'expo.inOut'
		});

		if (window.Modernizr.mq('(max-width: ' + lg + 'px)')) {
			cols = colsTablet;
		}

		if (window.Modernizr.mq('(max-width: ' + md + 'px)')) {
			cols = colsMobile;
		}

		for (var index = 0; index < this.$items.length; index = index + cols) {

			var
				$array = this.$items.slice(index, index + cols),
				tl = new gsap.timeline();

			tl
				.to($array, {
					duration: 0.9,
					autoAlpha: 1,
					y: '0%',
					force3D: true,
					scaleY: 1,
					ease: 'power3.out',
					stagger: 0.15
				}, 'start');

			this._createScene({
				element: $array[0],
				triggerHook: 0.95,
				timeline: tl,
				reveal: false
			});

		}

		this._createScene({
			element: this.$el,
			timeline: masterTL
		});
	}

	_bindGridFilter() {
		const
			self = this,
			event = new CustomEvent('arts/grid/filter');

		if (!this.$grid.length) {
			return;
		}

		this.filter = this._createFilter();
		this.grid = this._createGrid();

		if (this.$filter.length) {
			this.filter.setActiveItem(0);
			this.filter.$items.on('click', function (e) {
				const filterBy = $(this).data('filter');

				if (filterBy === '*') {
					self.$grid.removeClass('grid_filtered');
				} else {
					self.$grid.addClass('grid_filtered');
				}

				e.preventDefault();

				self.grid.isotope({
					filter: filterBy
				});
			});

			self.grid.on('arrangeComplete', () => {
				window.dispatchEvent(event);
			});
		}
	}

	_createFilter() {
		return new Filter({
			scope: this.$scope,
			target: this.$filter
		});
	}

	_createGrid() {
		return new Grid({
			target: this.$grid
		});
	}
}
