function PJAXFallbackClonedImage(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$currentContainer = $(data.current.container),
			$nextContainer = $(data.next.container),
			$curtain = $('#js-page-transition-curtain'),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			background = $nextMasthead.attr('data-background-color'),
			$clone = $('.clone');

		tl
			.set($clone, {
				clearProps: 'transition'
			})
			.setCurtain($curtain, {
				background
			})
			.add([
				gsap.effects.moveCurtain($curtain, {
					y: '0%',
					duration: 1.2
				}),
				gsap.to($clone, {
					autoAlpha: 0,
					duration: 0.6,
					display: 'none'
				})
			])
			.set($nextContainer, {
				clearProps: 'all',
				autoAlpha: 1,
				zIndex: 300,
			})
			.set($currentContainer, {
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				zIndex: '-1',
				autoAlpha: 0
			})
			.setCurtain($curtain)
			.add(() => resolve(true))
			.totalDuration(duration);
	})
}
