class Animations {
  constructor() {
    this._revealCurtain();
    this._moveCurtain();
    this._setCurtain();
    this._animateChars();
    this._animateLines();
    this._animateWords();
    this._hideChars();
    this._hideLines();
    this._hideWords();
    this._animateHeadline();
  }

  _setCurtain() {
    gsap.registerEffect({
      name: 'setCurtain',
      effect: (target, config) => {
        const
          tl = new gsap.timeline(),
          $target = $(target);

        if (!$target.length) {
          return tl;
        }

        const
          $svg = $target.find('.curtain-svg'),
          $normal = $target.find('.curtain-svg__normal'),
          $curve = $target.find('.curtain-svg__curve'),
          $rect = $target.find('.curtain__rect');

        tl
          .set($target, {
            display: 'none',
            autoAlpha: 1,
            y: config.y
          })
          .set($svg, {
            fill: config.background,
          });

        return tl;

      },
      extendTimeline: true,
      defaults: {
        y: '100%'
      }
    });
  }

  _moveCurtain() {
    gsap.registerEffect({
      name: 'moveCurtain',
      effect: (target, config) => {
        const
          tl = new gsap.timeline(),
          $target = $(target);

        if (!$target.length) {
          return tl;
        }

        const
          $svg = $target.find('.curtain-svg'),
          $normal = $svg.find('.curtain-svg__normal');

        let $curveTop, $curveBottom;

        if (window.innerWidth / window.innerHeight >= 1) {
          $curveTop = $target.find('.curtain-svg__curve_top-desktop');
          $curveBottom = $svg.find('.curtain-svg__curve_bottom-desktop');
        } else {
          $curveTop = $svg.find('.curtain-svg__curve_top-mobile');
          $curveBottom = $svg.find('.curtain-svg__curve_bottom-mobile');
        }

        tl
          .set($target, {
            display: 'block',
            autoAlpha: 1
          })
          .set([$curveTop, $curveBottom], {
            visibility: 'hidden',
          })
          .to($target, {
            y: config.y,
            duration: 1.8,
            ease: 'expo.inOut'
          });

        if (config.curve === 'top') {
          tl
            .set($normal, {
              visibility: 'visible'
            }, '0')
            .to($normal, {
              duration: 0.9,
              ease: 'power2.out',
              morphSVG: $curveTop[0]
            }, '-=1.8')
            .to($normal, {
              duration: 0.9,
              ease: 'power2.out',
              morphSVG: $normal[0],
              overwrite: 'all'
            }, '-=0.9');
        } else {
          tl
            .set($normal, {
              visibility: 'visible',
            }, '0')
            .to($normal, {
              duration: 0.9,
              ease: 'power2.out',
              morphSVG: $curveBottom[0],
              overwrite: 'all',
            }, '-=1.8')
            .to($normal, {
              duration: 0.9,
              ease: 'power2.out',
              morphSVG: $normal[0],
            });
        }

        tl.totalDuration(config.duration);

        return tl;

      },
      extendTimeline: true,
      defaults: {
        duration: 2.4,
        curve: 'top',
        y: '0%'
      }
    });
  }

  _revealCurtain() {
    gsap.registerEffect({
      name: 'revealCurtain',
      effect: (target, config) => {
        const
          tl = new gsap.timeline(),
          $target = $(target);

        if (!$target.length) {
          return tl;
        }

        const
          $normal = $target.find('.curtain-svg__normal'),
          $curve = $target.find('.curtain-svg__curve');

        tl
          .set($target, {
            y: '100%',
            autoAlpha: 1
          })
          .set($normal, {
            visibility: 'visible'
          })
          .set($curve, {
            visibility: 'hidden',
          })
          .to($target, {
            y: '0%',
            duration: 1.8,
            ease: 'expo.inOut'
          })
          .to($normal, {
            duration: 0.9,
            ease: 'power2.out',
            morphSVG: $curve[0]
          }, '-=1.8')
          .to($normal, {
            duration: 0.9,
            ease: 'power2.out',
            morphSVG: $normal[0],
            overwrite: 'all'
          }, '-=0.9');

        tl.totalDuration(config.duration)

        return tl;

      },
      extendTimeline: true,
      defaults: {
        duration: 2.4
      }
    });
  }

  _animateChars() {
    gsap.registerEffect({
      name: 'animateChars',
      effect: (target, config) => {
        const
          $target = $(target),
          $chars = $target.find('.split-text__char');

        let textAlign;

        if (!$chars.length) {
          return;
        }

        textAlign = $target.css('text-align');

        if (!config.stagger.from) {

          switch (textAlign) {
            case 'left':
              config.stagger.from = 'start';
              break;
            case 'center':
              config.stagger.from = 'center';
              break;
            case 'right':
              config.stagger.from = 'end';
              break;
          }

        }

        return gsap.to($chars, config);
      },
      defaults: {
        xPercent: 0,
        yPercent: 0,
        x: '0%',
        y: '0%',
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.inOut',
        stagger: distributeByPosition({
          from: 'start',
          amount: 0.3
        })
      },
      extendTimeline: true,
    });
  }

  _animateLines() {
    gsap.registerEffect({
      name: 'animateLines',
      effect: (target, config) => {
        const $target = $(target);
        let $lines = $target.find('.split-text__line');

        if (!$lines.length) {
          return;
        }

        if (config.excludeEl) {
          $lines = $lines.not(config.excludeEl);
          delete config.excludeEl;
        }

        return gsap.to($lines, config);
      },
      defaults: {
        xPercent: 0,
        yPercent: 0,
        x: '0%',
        y: '0%',
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: {
          amount: 0.08
        }
      },
      extendTimeline: true,
    });
  }

  _animateWords() {
    gsap.registerEffect({
      name: 'animateWords',
      effect: (target, config) => {
        const
          $target = $(target),
          $words = $target.find('.split-text__word');

        if (!$words.length) {
          return;
        }

        return gsap.to($words, config);
      },
      defaults: {
        duration: 1.2,
        y: '0%',
        ease: 'power3.out',
        stagger: {
          amount: 0.2
        }
      },
      extendTimeline: true,
    });
  }

  _hideChars() {
    gsap.registerEffect({
      name: 'hideChars',
      effect: (target, config) => {
        const
          $target = $(target),
          $chars = $target.find('.split-text__char'),
          textAlign = $target.css('text-align');

        if (!$chars.length) {
          return;
        }

        if (!config.stagger.from) {

          switch (textAlign) {
            case 'left':
              config.stagger.from = 'start';
              break;
            case 'center':
              config.stagger.from = 'center';
              break;
            case 'right':
              config.stagger.from = 'end';
              break;
          }

        }

        if (config.duration === 0) {
          config.stagger = 0;
        }

        return gsap.to($chars, config);
      },
      defaults: {
        duration: 1.2,
        x: '0%',
        y: '100%',
        autoAlpha: 0,
        ease: 'power3.inOut',
        stagger: distributeByPosition({
          from: 'center',
          amount: 0.3
        })
      },
      extendTimeline: true,
    });
  }

  _hideLines() {
    gsap.registerEffect({
      name: 'hideLines',
      effect: (target, config) => {
        const
          $target = $(target),
          $lines = $target.find('.split-text__line');

        if (!$lines.length) {
          return;
        }

        if (config.duration === 0) {
          config.stagger = 0;
        }

        return gsap.to($lines, config);
      },
      defaults: {
        y: '-100%',
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: {
          amount: 0.02
        }
      },
      extendTimeline: true,
    });
  }

  _hideWords() {
    gsap.registerEffect({
      name: 'hideWords',
      effect: (target, config) => {
        const
          $target = $(target),
          $words = $target.find('.split-text__word');

        if (!$words.length) {
          return;
        }

        return gsap.to($words, config);
      },
      defaults: {
        y: '-100%',
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: {
          amount: 0.02
        }
      },
      extendTimeline: true,
    });
  }

  _animateHeadline() {
    gsap.registerEffect({
      name: 'animateHeadline',
      effect: (target, config) => {
        const
          $target = $(target);

        let textAlign;
        textAlign = $target.css('text-align');

        if (!config.transformOrigin) {

          switch (textAlign) {
            case 'left':
              config.transformOrigin = 'left center';
              break;
            case 'center':
              config.transformOrigin = 'center center';
              break;
            case 'right':
              config.transformOrigin = 'right center';
              break;
          }

        }

        return gsap.to($target, config);
      },
      defaults: {
        scaleX: 1,
        scaleY: 1,
        duration: 1.2,
        ease: 'power3.inOut',
      },
      extendTimeline: true,
    });
  }
}
