const PJAXTransitionOverlayMenu = {
	name: 'overlayMenu',

	custom: ({
		trigger
	}) => {
		return window.theme.header.isOverlayOpened() || $(trigger).data('pjax-link') === 'overlayMenu';
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => {
				resolve(true);
			});
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => {
				resolve(true);
			});
		});
	},

	afterEnter: (data) => {
		return new Promise((resolve) => {
			const
				tl = new gsap.timeline(),
				$currentContainer = $(data.current.container),
				$nextContainer = $(data.next.container),
				$curtain = $('#js-header-curtain-transition'),
				closeTl = window.theme.header.closeMenuTransition(true),
				$nextMasthead = $nextContainer.find('.section-masthead'),
				background = $nextMasthead.attr('data-background-color');

			window.theme.header.setBurger();

			tl
				.set([$nextContainer, $currentContainer], {
					autoAlpha: 0,
				})
				.setCurtain($curtain, {
					background
				})
				.moveCurtain($curtain, {
					duration: 1.2,
					y: '0%',
					curve: 'top',
				})
				.add(closeTl, '-=0.8')
				.setCurtain($curtain)
				.set($nextContainer, {
					clearProps: 'all',
					autoAlpha: 1,
				})
				.add(() => {
					resolve(true);
				});

		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => {
				resolve(true);
			});
		});
	}
}
