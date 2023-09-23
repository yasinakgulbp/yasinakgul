const PJAXTransitionFlyingImage = {
	name: 'flyingImage',

	custom: ({
		trigger
	}) => {
		return $(trigger).data('pjax-link') === 'flyingImage';
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeLeave: (data) => {
		return new Promise((resolve) => {
			const
				$currentContainer = $(data.current.container),
				$content = $currentContainer.find('.page-wrapper__content'),
				$trigger = $(data.trigger),
				isNavProjectsLink = $trigger.hasClass('section-nav-projects__link'),
				isListHoverLink = $trigger.hasClass('js-list-hover__link');

			let $image, delay;

			if (isNavProjectsLink) {
				$image = $currentContainer.find('.section-nav-projects .js-transition-img');
				delay = 0;
			} else {
				$image = $trigger.find('.js-transition-img');
				delay = 150;
			}

			if (isListHoverLink) {
				$image = $trigger.find('.js-transition-img');

				PJAXCloneImage($image, $trigger.data('coordinates')).then(() => {
					gsap.to($content, {
						duration: 0.3,
						autoAlpha: 0,
						onComplete: () => {
							resolve(true);
						}
					});
				});

			} else {
				setTimeout(() => {
					PJAXCloneImage($image).then(() => {
						gsap.to($content, {
							duration: 0.3,
							autoAlpha: 0,
							onComplete: () => {
								resolve(true);
							}
						});
					});
				}, delay);
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
