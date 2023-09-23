class Form {
	constructor({
		scope,
		target
	}) {
		this.$scope = scope;
		this.$target = target;

		if (this.$scope.length) {
			this.set();
			this.run();
		}
	}

	set() {
		this.input = '.input-float__input';
		this.inputClassNotEmpty = 'input-float__input_not-empty';
		this.inputClassFocused = 'input-float__input_focused';
		this.$inputs = this.$scope.find(this.input);
	}

	run() {
		this._floatLabels();
		this._bindEvents();
	}

	_floatLabels() {
		const self = this;

		if (!this.$inputs || !this.$inputs.length) {
			return false;
		}

		this.$inputs.each(function () {
			const
				$el = $(this),
				$controlWrap = $el.parent('.wpcf7-form-control-wrap');

			// not empty value
			if ($el.val()) {
				$el.addClass(self.inputClassNotEmpty);
				$controlWrap.addClass(self.inputClassNotEmpty);
				// empty value
			} else {
				$el.removeClass([self.inputClassFocused, self.inputClassNotEmpty]);
				$controlWrap.removeClass([self.inputClassFocused, self.inputClassNotEmpty]);
			}

			// has placeholder & empty value
			if ($el.attr('placeholder') && !$el.val()) {
				$el.addClass(self.inputClassNotEmpty);
				$controlWrap.addClass(self.inputClassNotEmpty);
			}
		});

	}

	_bindEvents() {
		const self = this;

		this.$scope
			.off('focusin')
			.on('focusin', self.input, function () {
				const
					$el = $(this),
					$controlWrap = $el.parent('.wpcf7-form-control-wrap');

				$el.addClass(self.inputClassFocused).removeClass(self.inputClassNotEmpty);
				$controlWrap.addClass(self.inputClassFocused).removeClass(self.inputClassNotEmpty);

			})
			.off('focusout')
			.on('focusout', self.input, function () {

				const
					$el = $(this),
					$controlWrap = $el.parent('.wpcf7-form-control-wrap');

				// not empty value
				if ($el.val()) {
					$el.removeClass(self.inputClassFocused).addClass(self.inputClassNotEmpty);
					$controlWrap.removeClass(self.inputClassFocused).addClass(self.inputClassNotEmpty);
				} else {
					// has placeholder & empty value
					if ($el.attr('placeholder')) {
						$el.addClass(self.inputClassNotEmpty);
						$controlWrap.addClass(self.inputClassNotEmpty);
					}

					$el.removeClass(self.inputClassFocused);
					$controlWrap.removeClass(self.inputClassFocused);
				}

			});

	}

	_getModalTemplate({
		icon,
		message
	}) {
		return `
      <div class="modal" id="modalContactForm">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content radius-img">
            <div class="modal__close" data-dismiss="modal"><img src="./img/general/icon-close.svg"/></div>
              <header class="text-center mb-1">
                <img src="${icon}" width="80" alt=""/>
                <p class="modal__message h4"><strong>${message}</strong></p>
              </header>
              <button type="button" class="button button_solid button_black button_fullwidth" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    `;
	}

	_createModal({
		template,
		onDismiss
	}) {

		if (!template) {
			return false;
		}

		let $modal;
		window.$body.append(template);
		$modal = $('#modalContactForm');

		$modal.modal('show');
		$modal.on('hidden.bs.modal', () => {
			if (typeof onDismiss === 'function') {
				onDismiss();
			}
			$modal.modal('dispose').remove();
		});
	}
}
