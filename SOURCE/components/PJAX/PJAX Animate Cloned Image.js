function PJAXAnimateClonedImage(data, duration = 2.0) {
	window.dispatchEvent(new CustomEvent('arts/barba/transition/clone/before'));

	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$nextContainer = $(data.next.container),
			$curtain = $('#js-page-transition-curtain'),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			background = $nextMasthead.attr('data-background-color'),
			$target = $nextMasthead.find('.js-transition-img'),
			target = $target.get(0),
			$clone = $('.clone'),
			$bgClone = $clone.find('.js-transition-img__transformed-el'),
			$bgTarget = $target.find('.js-transition-img__transformed-el'),
			bgTarget = $bgTarget.get(0);

		if (!$target.length || !$clone.length) {
			resolve(true);
			return;
		}

		const bgTargetProperties = $bgTarget.css(['width', 'height', 'objectPosition', 'objectFit']),
			{
				top,
				left,
				width,
				height,
			} = target.getBoundingClientRect(),
			bgTargetScale = gsap.getProperty(bgTarget, 'scale'),
			bgTargetTranslateX = gsap.getProperty(bgTarget, 'x'),
			bgTargetTranslateY = gsap.getProperty(bgTarget, 'y'),
			targetTransform = $target.css('transform'),
			targetBorderRadius = $target.css('border-radius'),
			targetClippath = $clone.css('clip-path') === 'none' ? '' : 'circle(100% at center)';


		tl
			.setCurtain($curtain, {
				background
			})
			.set($clone, {
				maxWidth: '100%',
				maxHeight: '100%',
			})
			.add([
				gsap.to($bgClone, {
					scale: bgTargetScale,
					xPercent: bgTargetTranslateX,
					yPercent: bgTargetTranslateY,
					paddingBottom: 0,
					width: bgTargetProperties.width,
					height: bgTargetProperties.height,
					objectFit: bgTargetProperties.objectFit,
					objectPosition: bgTargetProperties.objectPosition,
					duration: 1.2,
					ease: 'expo.inOut',
					transition: 'none',
					top: 'auto',
					left: 'auto',
					right: 'auto',
					bottom: 'auto',
					autoRound: false
				}),
				gsap.to($clone, {
					transform: targetTransform,
					top,
					left,
					width,
					height,
					duration: 1.2,
					ease: 'expo.inOut',
					transition: 'none',
					borderRadius: targetBorderRadius,
					clipPath: targetClippath,
					autoRound: false,
					onComplete: () => {
						Scroll.scrollToTop();
					}
				}),
				gsap.effects.moveCurtain($curtain, {
					y: '0%',
					duration: 1.2
				}),
			])
			.to($nextContainer, {
				duration: 0.2,
				clearProps: 'all',
				autoAlpha: 1,
			}, '-=0.3')
			.setCurtain($curtain)
			.add(() => {
				resolve(true);
			})
			.totalDuration(duration);
	});
}
