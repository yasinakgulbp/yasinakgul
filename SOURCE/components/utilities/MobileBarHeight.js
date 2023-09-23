class MobileBarHeight {
	constructor() {
		this.vh = 0;
		this._createStyleElement();
		this._setVh();
		this._bindEvents();
	}

	_setVh() {
		this.vh = window.innerHeight * 0.01;
		$('#arts-fix-bar').html(`:root { --fix-bar-vh: ${this.vh}px; }`);
	}

	_bindEvents() {
		window.$window.on('resize', debounce(() => {
			this._setVh();
		}, 250));
	}

	_createStyleElement() {
		if (!$('#arts-fix-bar').length) {
			$('head').append('<style id="arts-fix-bar"></style>');
		}
	}
}
