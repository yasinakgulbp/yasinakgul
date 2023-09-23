function PJAXSetNextContainer(data) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			tl = new gsap.timeline();

		tl.add(() => {
				$nextContainer.find('.section-masthead .section-masthead__background').addClass('js-cancel-animation');
			})
			.set($nextContainer, {
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				zIndex: 300,
				autoAlpha: 0
			})
			.add(() => {
				resolve(true);
			});
	});
}
