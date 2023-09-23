function checkIsAnchor($el) {
	const link = $el.attr('href');

	if ($el.length && link.length && link !== '#') {
		return true;
	} else {
		return false;
	}
}
