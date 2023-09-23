class Grid extends BaseComponent {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
		this.lazyInstance = new LazyLoad({
			scope
		});
		this.$lazyImages = this.$target.find('img[data-src]');
		this.isotopeInstance;
		this._layoutImages();
		this._layoutLazyImages();

		return this.isotopeInstance;
	}

	run() {
		this.isotopeInstance = this.$target.isotope({
			itemSelector: '.js-grid__item',
			columnWidth: '.js-grid__sizer',
			percentPosition: true,
			horizontalOrder: true,
		});

		setTimeout(() => {
			this.isotopeInstance.isotope('layout');
		}, 600);
	}

	_layoutImages() {
		this.$target
			.imagesLoaded()
			.progress(() => {
				this.isotopeInstance.isotope('layout');
			})
			.done(() => {
				setTimeout(() => {
					this.isotopeInstance.isotope('layout');
				}, 300);
			});
	}

	_layoutLazyImages() {
		this.lazyInstance.loadImages({
			target: this.$lazyImages,
			callback: () => {
				this._layoutImages();
			}
		});
	}
}
