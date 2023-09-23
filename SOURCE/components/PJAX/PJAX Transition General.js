const PJAXTransitionGeneral = {
	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeLeave: (data) => {
		return new Promise((resolve) => {
			const tl = new gsap.timeline();

			tl
				.setCurtain()
				.add(() => {
					resolve(true)
				})
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			const $nextContainer = $(data.next.container);

			$nextContainer.find('.section-masthead .section-masthead__background').addClass('js-cancel-animation');
			resolve(true)
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => resolve(true));
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			const
				tl = new gsap.timeline(),
				$nextContainer = $(data.next.container),
				$curtain = $('#js-page-transition-curtain'),
				$nextMasthead = $nextContainer.find('.section-masthead'),
				background = $nextMasthead.attr('data-background-color');

			tl
				.setCurtain($curtain, {
					background
				})
				.moveCurtain($curtain, {
					y: '0%',
					duration: 1.2
				})
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
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}
