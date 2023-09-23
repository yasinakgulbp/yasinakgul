class FormAJAX extends Form {
	constructor(options) {
		super(options);
		this.inputClassError = 'form__error';
		this.method = this.$target.attr('method');
		this.action = this.$target.attr('action');
		this.messages = {
			success: this.$target.attr('data-message-success'),
			error: this.$target.attr('data-message-error')
		};
		this._validate();
	}

	_validate() {
		const self = this;

		this.$target.validate({
			errorElement: 'span',
			errorPlacement: (error, element) => {
				error.appendTo(element.parent()).addClass(self.inputClassError);
			},
			submitHandler: (form) => {
				self._submit(form);
			}
		});
	}

	_submit() {
		const self = this;

		$.ajax({
			type: self.$target.attr('method'),
			url: self.$target.attr('action'),
			data: self.$target.serialize()
		}).done(() => {
			self._createModal({
				template: self._getModalTemplate({
					icon: './img/general/icon-success.svg',
					message: self.messages.success
				}),
				onDismiss: () => {
					self.$target.trigger('reset');
					self._floatLabels();
				}
			});
		}).fail(() => {
			self._createModal({
				template: self._getModalTemplate({
					icon: './img/general/icon-error.svg',
					message: self.messages.error
				})
			});
		});
	}
}
