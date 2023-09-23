class SliderCounter {
	constructor({
		slider,
		sliderCounter,
		slideClass = '',
		total,
		style = 'roman',
		addZeros = 2
	}) {

		if (!slider || !sliderCounter || !$(slider).length || !$(sliderCounter).length) {
			return false;
		}

		this.slider = slider;
		this.sliderCounter = sliderCounter;
		this.slideClass = slideClass;
		this.numOfSlides = slider.slides.length;
		this.startSlides = parseInt(slider.params.slidesPerView, 10);
		this.romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
		this.zeros = addZeros;
		this.style = style;
		this.total = total;

		switch (this.zeros) {
			case 0:
				this.prefixCurrent = '';
				this.prefixTotal = '';
				break;
			case 1:
				this.prefixCurrent = '0';
				this.prefixTotal = this.numOfSlides >= 10 ? '' : '0';
				break;
			case 2:
				this.prefixCurrent = '00';
				this.prefixTotal = this.numOfSlides >= 10 ? '0' : '00';
				break;
		}

		this._createSlider();
		this._renderCounter();
		this._renderTotal();
		this._bindEvents();

		return this.counter;
	}

	_createSlider() {
		this.counter = new Swiper(this.sliderCounter[0], {
			speed: this.slider.params.speed,
			direction: 'vertical',
			simulateTouch: false,
			allowTouchMove: false,
			on: {
				init: this.removeAllSlides
			}
		});
	}

	_renderCounter() {
		for (let index = this.startSlides; index <= this.numOfSlides; index++) {

			if (this.style === 'roman') {
				this.counter.appendSlide(this._getSlideTemplate({
					slideClass: this.slideClass,
					content: this.romanNumerals[index - 1]
				}));
			} else {
				const prefix = index >= 10 ? this.prefixCurrent = '0' : this.prefixCurrent;

				this.counter.appendSlide(this._getSlideTemplate({
					slideClass: this.slideClass,
					content: prefix + index
				}));
			}

		}
	}

	_renderTotal() {
		const $el = $(this.total);

		if ($el.length) {
			$el.html(this.style === 'roman' ? this.romanNumerals[this.numOfSlides - 1] : this.prefixTotal + this.numOfSlides);
		}
	}

	_getSlideTemplate({
		slideClass,
		content
	}) {
		return `<div class="swiper-slide"><div class="${slideClass}">${content}</div></div>`;
	}

	_bindEvents() {
		this.slider.on('slideChange', () => {
			this.counter.slideTo(this.slider.realIndex);
		});
	}
}
