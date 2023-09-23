const PJAXTransitionFullscreenSlider = {
	name: 'fullscreenSlider',

	custom: ({
		trigger
	}) => {
		return $(trigger).data('pjax-link') === 'fullscreenSlider';
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeLeave: (data) => {
		return new Promise((resolve) => {
			const
				tl = new gsap.timeline(),
				$currentContainer = $(data.current.container),
				$content = $currentContainer.find('.page-wrapper__content'),
				$trigger = $(data.trigger),
				$slider = $trigger.closest('.js-slider'),
				$image = $slider.find('.swiper-slide-active .js-transition-img'),
				$bg = $image.find('.slider__bg'),
				imageSrc = $bg.attr('data-texture-src');

			if (imageSrc) {
				tl
					.set($bg, {
						backgroundImage: `url(${imageSrc})`
					})
					.add(() => {
						PJAXCloneImage($image).then(() => {
							gsap.to($content, {
								duration: 0.3,
								autoAlpha: 0,
								onComplete: () => {
									resolve(true);
								}
							});
						});
					});
			} else {
				PJAXCloneImage($image).then(() => {
					gsap.to($content, {
						duration: 0.3,
						autoAlpha: 0,
						onComplete: () => {
							resolve(true);
						}
					});
				});
			}
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			PJAXSetNextContainer(data).then(() => resolve(true));
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => resolve(true));
		});
	},

	afterEnter: (data) => {
		return new Promise((resolve) => {
			PJAXAnimateClonedImage(data).then(
				() => resolve(true),
				() => {
					PJAXFallbackClonedImage(data).then(() => resolve(true));
				}
			)
		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}
