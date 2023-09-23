function Preloader({
  scope = window.$document,
  target = $('#js-preloader'),
  curtain = {
    element: $('#js-page-transition-curtain'),
    background: $('.section-masthead').attr('data-background-color')
  },
  cursor = {
    element: $('#js-cursor'),
    offset: {
      top: 0.0,
      left: 0.0
    }
  },
  counter = {
    easing: 'power4.out',
    duration: 25,
    start: 0,
    target: 100,
    prefix: '',
    suffix: ''
  }
}) {

  const self = this;
  this.$scope = scope;
  this.$target = target;

  // Preloader
  this.$header = this.$target.find('.preloader__header');
  this.$content = this.$target.find('.preloader__content');
  this.$wrapperCounter = this.$target.find('.preloader__counter');
  this.$counter = this.$target.find('.preloader__counter-current');
  this.$wrapperCircle = this.$target.find('.preloader__circle');

  // Cursor
  this.cursor = cursor;
  this.cursor.centerX = parseFloat(this.$wrapperCircle.innerWidth() / 2);
  this.cursor.centerY = parseFloat(this.$wrapperCircle.innerHeight() / 2);
  this.cursor.posX = 0;
  this.cursor.posY = 0;
  this.cursor.follower = {};
  this.cursor.follower.element = this.cursor.element.find('.cursor__follower');
  this.cursor.follower.inner = this.cursor.element.find('#inner');
  this.cursor.follower.outer = this.cursor.element.find('#outer');
  this.cursor.follower.size = {
    element: {
      width: this.cursor.follower.element.width(),
      height: this.cursor.follower.element.height()
    },
    inner: {
      cx: this.cursor.follower.inner.attr('cx'),
      cy: this.cursor.follower.inner.attr('cy'),
      r: this.cursor.follower.inner.attr('r')
    },
    outer: {
      cx: this.cursor.follower.outer.attr('cx'),
      cy: this.cursor.follower.outer.attr('cy'),
      r: this.cursor.follower.outer.attr('r')
    }
  }; // original circles dimensions

  // Mouse Coordinates
  this.mouseX = window.mouseX || window.innerWidth / 2;
  this.mouseY = window.mouseY || window.innerHeight / 2;

  // Curtain
  this.curtain = curtain;
  this.curtain.svg = this.curtain.element.find('.curtain-svg');
  this.curtain.rect = this.curtain.element.find('.curtain__rect');

  // Counter
  this.counter = counter;
  this.counter.val = 0;

  // Main Preloader Timeline
  this.timeline = new gsap.timeline({});

  // Animation Tweens
  this.tweens = {
    drawCircle: gsap.fromTo(this.cursor.follower.outer, {
      rotate: 90,
      drawSVG: '100% 100%',
      transformOrigin: 'center center',
    }, {
      drawSVG: '0% 100%',
      rotate: 0,
      transformOrigin: 'center center',
      ease: this.counter.easing,
      duration: this.counter.duration,
      paused: true,
    }),
    count: gsap.to(this.counter, {
      duration: this.counter.duration,
      val: this.counter.target,
      ease: this.counter.easing,
      paused: true,
      onUpdate: () => {
        const value = parseFloat(this.counter.val).toFixed(0);
        this.$counter.text(this.counter.prefix + value + this.counter.suffix);
      },
    }),
    followMouse: gsap.to({}, {
      paused: true,
      duration: 0.01,
      repeat: -1,
      onRepeat: () => {
        this.cursor.posX += (window.mouseX - this.cursor.posX);
        this.cursor.posY += (window.mouseY - this.cursor.posY - this.cursor.offset.top);
        gsap.to(this.cursor.element, {
          duration: 0.3,
          top: 0,
          left: 0,
          scale: (this.cursor.posX && this.cursor.posY) ? 1 : 0,
          autoAlpha: (this.cursor.posX && this.cursor.posY) ? 1 : 0,
          x: this.cursor.posX || window.innerWidth / 2,
          y: this.cursor.posY + this.cursor.offset.top || window.innerHeight / 2,
        });
      },
    })
  };

  _bindEvents();

  this.start = () => {
    window.dispatchEvent(new CustomEvent('arts/preloader/start'));

    if (!this.$target.length) {
      return;
    }

    window.$body.addClass('cursor-progress');

    if (this.cursor.element.length) {
      gsap.set(this.cursor.element, {
        display: 'block',
        top: '50%',
        left: '50%',
      });

      gsap.set(this.cursor.follower.element, {
        width: this.$wrapperCircle.innerWidth(),
        height: this.$wrapperCircle.innerHeight(),
      });

      gsap.set([this.cursor.follower.inner, this.cursor.follower.outer], {
        attr: {
          cx: this.cursor.centerX,
          cy: this.cursor.centerY,
          r: this.cursor.centerX - 1,
        }
      });
    }

    if (this.curtain.element.length) {
      gsap.set(this.curtain.svg, {
        fill: this.curtain.background
      });

      gsap.set(this.curtain.rect, {
        background: this.curtain.background
      });

      gsap.set(window.$pageContent, {
        autoAlpha: 0
      });
    }

    this.timeline.add([
      this.tweens.count.play(),
      this.tweens.drawCircle.play()
    ]);

  }

  this.finish = () => {
    return new Promise((resolve, reject) => {
      if (!this.$target.length) {
        window.dispatchEvent(new CustomEvent('arts/preloader/end'));
        resolve(true);
        return;
      }

      this.timeline
        .clear()
        .set(this.cursor.follower.outer, {
          attr: {
            transform: ''
          }
        })
        .to(this.cursor.follower.outer, {
          drawSVG: '0% 100%',
          rotate: 0,
          transformOrigin: 'center center',
          ease: 'expo.inOut',
          duration: 1.2
        }, 'start')
        .add([
          gsap.to(this.counter, {
            duration: 1.2,
            val: this.counter.target,
            ease: 'expo.inOut',
            onUpdate: () => {
              const value = parseFloat(this.counter.val).toFixed(0);
              this.$counter.text(this.counter.prefix + value + this.counter.suffix);
            }
          }),
        ], 'start')
        .add([
          this.tweens.followMouse.play(),
          gsap.to(this.cursor.follower.element, {
            width: this.cursor.follower.size.element.width,
            height: this.cursor.follower.size.element.height,
            ease: 'expo.out',
            duration: 1.2
          }),
          gsap.to(this.cursor.follower.inner, {
            attr: this.cursor.follower.size.inner,
            ease: 'expo.out',
            duration: 1.2,
          }),
          gsap.to(this.cursor.follower.outer, {
            attr: this.cursor.follower.size.outer,
            ease: 'expo.out',
            autoAlpha: 0,
            duration: 1.2,
          }),
        ])
        .add([
          gsap.effects.moveCurtain(this.curtain.element, {
            duration: 1.2
          }),
          gsap.to(this.$content, {
            y: -30,
            delay: 0.1,
            duration: 0.8,
            ease: 'power3.inOut',
          }),
          gsap.to(this.$target, {
            delay: 0.2,
            display: 'none',
            duration: 0.8,
            ease: 'power3.inOut',
          })
        ], '-=1.2')
        .set(window.$pageContent, {
          autoAlpha: 1
        })
        .to(this.curtain.element, {
          autoAlpha: 0,
          delay: 0.4,
          duration: 0.3
        })
        .set([this.$target, this.curtain.element], {
          y: '-100%',
          display: 'none',
        })
        .set(this.cursor.element, {
          clearProps: 'top,left',
          x: '-50%',
          y: '-50%'
        })
        .add(() => {
          window.dispatchEvent(new CustomEvent('arts/preloader/end'));
          window.$body.removeClass('cursor-progress');
          this.tweens.followMouse.kill();
          resolve(true);
        }, '-=0.6');

    });
  }

  function _bindEvents() {
    self.$scope.on('mousemove', (e) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    });
  }

}
