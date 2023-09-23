class PSWPGallery extends Pswp {
	constructor({
		scope,
		target,
		options
	}) {
		super({
			scope,
			target,
			options
		});

		this.hashData = this._photoswipeParseHash();
		if (this.$target.length && !window.theme.ajax.enabled && this.hashData.pid && this.hashData.gid) {
			this._openPhotoSwipe({
				index: this.hashData.pid,
				galleryElement: this.$target.eq(this.hashData.gid - 1),
				disableAnimation: true,
				fromURL: true
			});
		}
	}

	run($el) {
		this._bindClickGalleryLinks($el);
	}

	_bindClickGalleryLinks($gallery) {
		const self = this,
			$links = $gallery.find('a');

		$links.on('click', function (e) {
			const
				tl = new gsap.timeline(),
				$el = $(this),
				$parallaxEl = $el.find('[data-arts-parallax] > *'),
				scale = gsap.getProperty($parallaxEl.get(0), 'scale'),
				index = $links.index($el);

			e.preventDefault();

			tl
				.add(() => {
					window.$body.addClass('pointer-events-none');
				})
				.set(self.$container, {
					transition: 'none'
				})
				.to($parallaxEl, {
					scale: 1,
					duration: 0.3,
				})
				.add(() => {
					self._openPhotoSwipe({
						index,
						galleryElement: $gallery
					});
				})
				.set($parallaxEl, {
					delay: 0.1,
					scale: scale,
					overwrite: 'all',
				})
				.set($el, {
					autoAlpha: 1
				})
				.add(() => {
					window.$body.removeClass('pointer-events-none');
				});
		});
	}
}
