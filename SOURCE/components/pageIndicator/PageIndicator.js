const PageIndicator = function ($scope) {
	const
		$target = $scope.find('.js-page-indicator'),
		$triggers = $scope.find('.js-page-indicator-trigger');

	if (!$target.length) {
		return;
	}

	$triggers.each(function () {

		let $current = $(this);

		$current
			.on('mouseenter touchstart', function () {

			})
			.on('mouseleave touchend', function () {

			});

	});
}
