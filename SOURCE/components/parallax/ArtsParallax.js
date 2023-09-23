class ArtsParallax {
	constructor({
		target,
		factor,
		ScrollMagicController,
		SmoothScrollBarController,
	}) {
		this.scene = null;
		this.$target = target;
		this.factor = factor || 0.3;
		this.SMController = ScrollMagicController;
		this.SBController = SmoothScrollBarController;
		this.run();
	}

	run() {
		const self = this;

		this.$target.each(function () {
			const
				$el = $(this),
				$parallaxTarget = $el.find('> *').length ? $el.find('> *') : $el,
				distanceToY = $el.data('arts-parallax-y') || 0,
				distanceToX = $el.data('arts-parallax-x') || 0,
				factorEl = parseFloat($el.data('arts-parallax-factor')) || parseFloat(self.factor);

			let
				tl = new gsap.timeline(),
				factorScale = 1 + Math.abs(factorEl),
				factorTo = Math.abs(factorEl) * 100,
				factorFrom = -1 * Math.abs(factorEl) * 100,
				sceneDuration = window.innerHeight + $parallaxTarget.height() * (factorScale * 2);

			// wrong calculated height
			if (sceneDuration - window.innerHeight < 50) {
				sceneDuration = window.innerHeight + $el.parent().height() * (factorScale * 2);
			}

			if (!$parallaxTarget.length && !distanceToX && !distanceToY) {
				return;
			}

			if (factorFrom > 0) {
				factorScale = factorScale * factorScale;
				factorTo = self.factor * 100;
			}

			// normal element (no scale)
			if ($el.data('arts-parallax') === 'element') {
				tl = self._getParallaxTimeline({
					element: $el,
					toY: distanceToY,
					toX: distanceToX
				});
			} else { // background or <img> (do scale to prevent image edges exposing)
				tl = self._getParallaxTimeline({
					element: $parallaxTarget,
					fromX: '0%',
					fromY: factorFrom + '%',
					toY: factorTo + '%',
					toX: '0%',
					scale: factorScale
				});
			}

			this.scene = self._addSceneToScrollMagic({
				trigger: $el,
				duration: sceneDuration,
				timeline: tl
			});

			window.$window.one('arts/barba/transition/init/after arts/barba/transition/clone/before', () => {
				this.scene.update(true);
			});
		});
	}

	_getParallaxTimeline({
		element,
		fromY,
		fromX,
		toY,
		toX,
		scale
	}) {
		return new gsap.timeline().fromTo(element, {
			y: fromY || 0,
			x: fromX || 0,
			scale: scale || 1,
			transformOrigin: 'center center',
		}, {
			y: toY || 0,
			x: toX || 0,
			force3D: true,
			ease: 'linear.none',
		});
	}

	_addSceneToScrollMagic({
		trigger,
		duration,
		timeline,
	}) {
		return new ScrollMagic.Scene({
				triggerElement: trigger,
				triggerHook: 1,
				duration: duration
			})
			.setTween(timeline)
			.addTo(this.SMController)
			.update(true);
	}
}
