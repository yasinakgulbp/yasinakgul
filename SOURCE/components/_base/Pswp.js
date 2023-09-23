class Pswp extends BaseComponent {
	constructor({
		scope,
		target,
		options
	}) {
		super({
			scope,
			target
		});
		this.options = options || {
			history: false,
			showAnimationDuration: 300,
		};
		this._setGalleriesID();
		this.$pswpEl = $('.pswp');
		this.$container = this.$pswpEl.find('.pswp__container');
		this.pswpEl = this.$pswpEl.get(0);
	}

	_bindEvents() {
		const eventTouchUp = new CustomEvent('arts/pswp/touchUp', {
				detail: {
					direction: 'all'
				}
			}),
			eventTouchDown = new CustomEvent('arts/pswp/touchDown', {
				detail: {
					direction: 'all'
				}
			}),
			eventClose = new CustomEvent('arts/pswp/close'),
			eventSlideChange = new CustomEvent('arts/pswp/slideChange');

		this.$pswpEl
			.off('click')
			.on('click', '.pswp__button--arrow--left', (e) => {
				e.preventDefault();
				this.gallery.prev();
			}).on('click', '.pswp__button--arrow--right', (e) => {
				e.preventDefault();
				this.gallery.next();
			});

		window.$window.on('arts/barba/transition/start', () => {
			if (typeof this.gallery === 'object' && this.gallery.destroy === 'function') {
				this.gallery.destroy();
			}
		});

		// Dispatch cursor events
		this.gallery.listen('preventDragEvent', (e, isDown, preventObj) => {
			preventObj.prevent = false;
			if ($(e.target).is('.pswp--zoomed-in .pswp__img')) {
				if (isDown) {
					document.dispatchEvent(eventTouchDown);
				} else {
					document.dispatchEvent(eventTouchUp);
				}
			}
		});

		this.gallery.listen('close', () => {
			document.dispatchEvent(eventClose);
			this.$pswpEl.find('iframe, video').remove();
		});

		this.gallery.listen('beforeChange', (e) => {
			document.dispatchEvent(eventSlideChange);
			this._stopVideo();
		});
	}

	_openPhotoSwipe({
		index = 0,
		galleryElement = null,
		disableAnimation = false,
		fromURL = false
	}) {
		const
			items = this._getItems(galleryElement, index),
			options = {
				galleryUID: galleryElement.attr('data-pswp-uid')
			};

		if (typeof items[index] !== 'undefined' && 'el' in items[index]) {
			options.getThumbBoundsFn = function (index) {
				let
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					img = items[index].el.querySelector('img'),
					rect;

				if (img) {
					rect = img.getBoundingClientRect();
					return {
						x: rect.left,
						y: rect.top + pageYScroll,
						w: rect.width
					}
				}
			}
		}

		// PhotoSwipe opened from URL
		if (fromURL) {
			if (options.galleryPIDs) {
				// parse real index when custom PIDs are used 
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for (let j = 0; j < items.length; j++) {
					if (items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				// in URL indexes start from 1
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if (isNaN(options.index)) {
			return;
		}

		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		this.gallery = new PhotoSwipe(this.pswpEl, PhotoSwipeUI_Default, items, $.extend(options, this.options));
		this.gallery.init();

		this._bindEvents();
	}

	_getMediaTypeFromURL(url, size, autoplay = false) {
		const
			result = {
				type: false,
				html: null
			},
			iframeSize = size ? size.split('x') : [640, 360],
			attr = {
				video: autoplay ? 'muted playsinline loop autoplay' : '',
			},
			param = {
				youtube: autoplay ? 'autoplay=1' : '',
				vimeo: autoplay ? 'autoplay=1' : ''
			},
			pattern = {
				image: /([-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?\.(?:jpg|jpeg|jfif|pjpeg|pjp|bmp|gif|png|apng|webp|svg))/gi,
				video: /([-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?\.(?:mp4|ogv|webm))/gi,
				youtube: /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)([^&|?|\/]*)/g,
				vimeo: /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(?:.*\/)?(.+)/g,
			};

		/**
		 * Image
		 */
		if (pattern.image.test(url)) {
			result.type = 'image';
			return result;
		}

		/**
		 * HTML5 video
		 */
		if (pattern.video.test(url)) {
			result.type = 'video';
			result.html = `<video src="${url}" controls ${attr.video}></video>`;
			return result;
		}

		/**
		 * YouTube link
		 */
		if (pattern.youtube.test(url)) {
			result.type = 'youtube';
			result.html = url.replace(pattern.youtube, `<iframe class="iframe-youtube" width="${parseInt(iframeSize[0])}" height="${parseInt(iframeSize[1])}" src="https://www.youtube.com/embed/$1?${param.youtube}&enablejsapi=1" frameborder="0" allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
			return result;
		}

		/**
		 * Vimeo link
		 */
		if (pattern.vimeo.test(url)) {
			result.type = 'vimeo';
			result.html = url.replace(pattern.vimeo, `<iframe class="iframe-vimeo" width="${parseInt(iframeSize[0])}" height="${parseInt(iframeSize[1])}" src="https://player.vimeo.com/video/$1?${param.vimeo}" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`);
			return result;
		}

		/**
		 * Fallback iFrame
		 */
		result.type = 'iframe';
		result.html = `<iframe width="${parseInt(iframeSize[0])}" height="${parseInt(iframeSize[1])}" src=${url} frameborder="0" allowfullscreen></iframe>`;

		return result;
	}

	_getItems($galleryElement, activeIndex = 0) {
		const
			self = this,
			$items = $galleryElement.find('a'),
			items = [];

		$items.each(function (index) {
			const $el = $(this),
				item = {},
				size = $el.attr('data-size'),
				autoplay = $el.attr('data-autoplay') && activeIndex === index, // autoplay only currently active item
				src = $el.attr('href'),
				media = self._getMediaTypeFromURL(src, size, autoplay),
				title = $el.attr('data-title');

			if (size) {
				const sizeSplit = size.split('x');
				item.w = parseInt(sizeSplit[0], 10);
				item.h = parseInt(sizeSplit[1], 10);
			}

			if (title) {
				item.title = title;
			}

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

	_photoswipeParseHash() {
		const
			hash = window.location.hash.substring(1),
			params = {};

		if (hash.length < 5) {
			return params;
		}

		const vars = hash.split('&');
		for (let i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			let pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	}

	_setGalleriesID() {
		this.$target.each(function (index) {
			$(this).attr('data-pswp-uid', index + 1);
		});
	}

	_stopVideo() {
		const
			$iframeYoutube = this.$pswpEl.find('.iframe-youtube'),
			$iframeVimeo = this.$pswpEl.find('.iframe-vimeo'),
			$video = this.$pswpEl.find('video');

		if ($iframeYoutube.length) {
			$iframeYoutube.each(function () {
				$(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
			});
		}

		if ($iframeVimeo.length) {
			$iframeVimeo.each(function () {
				$(this).get(0).contentWindow.postMessage('{"method":"pause"}', '*');
			});
		}

		if ($video.length) {
			$video.each(function () {
				$(this).get(0).pause();
			});
		}
	}
}
