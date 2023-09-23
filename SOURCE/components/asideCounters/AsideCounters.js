class AsideCounters extends BaseComponent {
	constructor({
		scope,
		target
	}) {
		super({
			scope,
			target
		});
	}

	run() {
		const
			self = this,
			$counters = this.$target.find('.js-counter');

		if (!$counters.length) {
			return false;
		}

		$counters.each(function () {
			new Counter({
				scope: self.scope,
				target: $(this)
			});
		});
	}
}
