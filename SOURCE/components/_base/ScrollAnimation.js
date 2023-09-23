class ScrollAnimation extends BaseComponent {

  constructor({
    target,
    scope
  }) {
    super({
      target,
      scope
    });

  }

  _hasAnimationScene($el) {
    return $el.attr('data-arts-os-animation');
  }

  _createScene({
    element,
    timeline,
    customTrigger = false,
    reveal = true,
    delay = 0,
    reverse = false,
    duration = 0,
    triggerHook
  }) {

    const masterTL = new gsap.timeline({
      delay: delay
    });

    let
      $trigger = element,
      scale = 1;

    if (customTrigger && customTrigger.length) {
      $trigger = customTrigger;
    }

    if (reveal === true) {
      // reveal hidden element first
      element.attr('data-arts-os-animation', 'animated');
    }

    masterTL.add(timeline, '0');

    if (window.theme !== 'undefined') {
      scale = window.theme.animations.timeScale.onScrollReveal || scale;
      masterTL.timeScale(scale);
    }

    return new $.ScrollMagic.Scene({
        triggerElement: $trigger,
        triggerHook: triggerHook || window.SMSceneTriggerHook,
        reverse: reverse || window.SMSceneReverse,
        duration: duration
      })
      .setTween(masterTL)
      .addTo(window.SMController);
  }
}
