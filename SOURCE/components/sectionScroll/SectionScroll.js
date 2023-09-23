class SectionScroll extends ScrollAnimation {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
	}
	set() {
		const self = this;

		this.$el.each(function () {
			const
				$el = $(this),
				duration = $el.innerHeight(),
				defaultTheme = $el.data('arts-default-theme'),
				defaultColor = $el.data('arts-theme-text'),
				scrollTheme = $el.data('arts-scroll-theme'),
				scrollColor = $el.data('arts-scroll-theme-text'),
				offset = parseFloat($el.data('arts-scroll-offset')),
				triggerHook = parseFloat($el.data('arts-scroll-trigger-hook')),
				scene = self._createScene({
					element: $el,
					triggerHook,
					offset,
					duration
				});

			scene
				.on('enter', () => {
					$el.removeClass(defaultTheme).addClass(scrollTheme);
					$el.attr('data-arts-theme-text', scrollColor);
				})
				.on('leave', () => {
					$el.removeClass(scrollTheme).addClass(defaultTheme);
					$el.attr('data-arts-theme-text', defaultColor);
				});
		});

	}
	_createScene({
		element,
		duration = 0,
		offset = 0,
		triggerHook = 0
	}) {
		return new $.ScrollMagic.Scene({
				triggerElement: element,
				triggerHook,
				reverse: true,
				duration,
				offset
			})
			.addTo(window.SMController);
	}
}
