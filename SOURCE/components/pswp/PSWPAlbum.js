class PSWPAlbum extends Pswp {
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
		if (this.$target.length && this.hashData.pid && this.hashData.gid) {
			this._openPhotoSwipe({
				index: this.hashData.pid,
				galleryElement: this.$target.eq(this.hashData.gid - 1),
				disableAnimation: true,
				fromURL: true
			});
		}
	}

	run($el) {
		this._bindClickAlbumLinks($el);
	}

	_bindClickAlbumLinks($gallery) {
		$gallery.on('click', (e) => {
			e.preventDefault();
			this._openPhotoSwipe({
				index: 0,
				galleryElement: $gallery
			});
		});
	}

	_getItems($galleryElement, activeIndex = 0) {
		const
			self = this,
			$items = $galleryElement.find('.js-album__items img'),
			items = [];

		$items.each(function (index) {
			const
				$el = $(this),
				src = $el.attr('data-album-src'),
				autoplay = $el.attr('data-autoplay') && activeIndex === index, // autoplay only currently active item
				media = self._getMediaTypeFromURL(src, null, autoplay),
				item = {
					w: $el.attr('width'),
					h: $el.attr('height'),
					title: $el.attr('data-title'),
				};

			switch (media.type) {
				case 'youtube':
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
					break;
				case 'vimeo':
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
					break;
				case 'video':
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
					break;
				case 'image':
					item.el = $el.get(0);
					item.src = src;
					item.msrc = $el.find('img').attr('src');
					break;
				default: // iframe
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
			}

			items.push(item);
		});

		return items;
	}
}
