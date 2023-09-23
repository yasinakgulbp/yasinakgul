function PJAXCloneImage(target, customCoordinates) {
	return new Promise((resolve) => {
		if (!target.length) {
			resolve(true);
			return;
		}

		const
			tl = new gsap.timeline(),
			$clone = target.clone(),
			{
				top,
				left,
				width,
				height
			} = target.get(0).getBoundingClientRect();

		// Scroll.lock(true);
		$clone.addClass('clone').appendTo(window.$barbaWrapper);

		tl
			.set($clone, {
				delay: 0.1,
				transform: target.css('transform'),
				transformOrigin: 'center center',
				position: 'fixed',
				display: 'block',
				top: customCoordinates ? customCoordinates.top : top,
				left: customCoordinates ? customCoordinates.left : left,
				width: customCoordinates ? customCoordinates.width : width,
				height: customCoordinates ? customCoordinates.height : height,
				zIndex: 350
			})
			.set(target, {
				autoAlpha: 0
			})
			.add(() => {
				resolve(true);
			});
	});
}
