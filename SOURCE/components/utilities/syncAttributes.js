function syncAttributes($sourceElement, $targetElement) {
	// single element
	if ($sourceElement.length === 1 && $targetElement.length === 1) {

		$targetElement.attr($sourceElement.getAllAttributes());

		// multiple elements
	} else if ($sourceElement.length > 1 && $targetElement.length > 1 && $sourceElement.length === $targetElement.length) {

		$.each($targetElement, function (index) {
			const
				$current = $(this),
				sourceAttributes = $sourceElement.eq(index).getAllAttributes();

			// source element doesn't have any attributes present
			if ($.isEmptyObject(sourceAttributes)) {
				// ... so remove all attributes from the target element
				[...this.attributes].forEach(attr => this.removeAttribute(attr.name));
			} else {
				$current.attr(sourceAttributes);
			}
		});
	}
}
