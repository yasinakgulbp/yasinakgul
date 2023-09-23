function getStaggerFrom($target) {
	if (!$target || !$target.length) {
		return;
	}

	const textAlign = $target.css('text-align');

	switch (textAlign) {
		case 'left':
			return 'start';
		case 'center':
			return 'center';
		case 'right':
			return 'end';
	}
}
