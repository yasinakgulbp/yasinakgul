class Slider extends BaseComponent {

  constructor({
    scope,
    target
  }) {
    super({
      target,
      scope
    });
  }

  _getSliderDots({
    slider,
    container
  }) {
    return new SliderDots({
      slider,
      container
    });
  }

  _getSliderCounter({
    slider,
    counter = {
      current,
      total,
      style,
      zeros
    }
  }) {
    return new SliderCounter({
      slider: slider,
      sliderCounter: counter.current,
      total: counter.total,
      style: counter.style,
      addZeros: counter.zeros
    });
  }

  _emitDragEvents({
    slider,
    target,
    customClass
  }) {
    const eventTouchUp = new CustomEvent('arts/slider/touchUp', {
      detail: {
        direction: slider.params.direction
      }
    });
    const eventTouchDown = new CustomEvent('arts/slider/touchDown', {
      detail: {
        direction: slider.params.direction
      }
    });

    slider.params.touchStartPreventDefault = false;

    slider
      .on('touchStart', () => {
        if (slider.params.autoplay.enabled) {
          slider.autoplay.stop();
        }

        if (customClass) {
          slider.$el.addClass(customClass);
        }

        target.dispatchEvent(eventTouchDown);
      })
      .on('touchEnd', () => {
        if (slider.params.autoplay.enabled) {
          slider.autoplay.start();
        }

        if (customClass) {
          slider.$el.removeClass(customClass);
        }

        target.dispatchEvent(eventTouchUp);
      });
  }

  _pauseAutoplay({
    slider
  }) {
    if (slider && slider.params.autoplay && slider.params.autoplay.enabled === true) {
      window.$window.on('arts/barba/transition/start', () => {
        slider.autoplay.stop();
      });

      if (window.$pagePreloader && window.$pagePreloader.length && window.$pagePreloader.is(':visible')) {
        window.$window
          .on('arts/preloader/start', () => {
            slider.autoplay.stop();
          })
          .on('arts/preloader/end', () => {
            slider.autoplay.start();
          });
      }
    }
  }
}
