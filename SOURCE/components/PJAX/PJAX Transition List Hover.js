const PJAXTransitionListHover = {
	name: 'listHover',

	custom: ({
		trigger
	}) => {
		return $(trigger).data('pjax-link') === 'listHover';
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
				$image = $trigger.find('.js-transition-img');

			let coordinates;
			if (!$image.is(':visible')) {
				coordinates = $trigger.data('coordinates');
			}

			PJAXCloneImage($image, coordinates).then(() => {
				gsap.to($content, {
					duration: 0.3,
					autoAlpha: 0,
					onComplete: () => resolve(true)
				});
			});
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
