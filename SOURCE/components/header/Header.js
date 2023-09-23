class Header {
	constructor() {
		this.$header = $('#page-header');
		this.$controls = this.$header.find('.header__controls');
		this.$stickyHeader = this.$header.filter('.js-header-sticky');
		this.$adminBar = $('#wpadminbar');
		this.$burger = $('#js-burger');
		this.$curtain = $('#js-header-curtain');
		this.$curtainTransition = $('#js-header-curtain-transition');
		this.$overlay = $('.header__wrapper-overlay-menu');
		this.burgerOpenClass = 'header__burger_opened';
		this.$headerColumns = this.$header.find('.header__col');
		this.$headerLeft = this.$header.find('.header__col-left');
		this.$overlayWidgets = this.$header.find('.header__wrapper-overlay-widgets');
		this.$allLinksOverlay = this.$header.find('.menu-overlay a');
		this.$allLinksClassic = this.$header.find('.menu a');

		// Menu
		this.$menuOverlay = this.$overlay.find('.js-menu-overlay');
		this.$menuLinks = this.$overlay.find('.menu-overlay > li > a');
		this.selectedClass = 'selected';
		this.openClass = 'opened';

		// Submenu
		this.$submenu = this.$overlay.find('.menu-overlay .sub-menu');
		this.$submenuButton = $('#js-submenu-back');
		this.$submenuOpeners = this.$overlay.find('.menu-item-has-children > a');
		this.$submenuLinks = this.$submenu.find('> li > a');

		// Sticky
		this.stickyScene = undefined;
		this.stickyClass = 'header_sticky';

		this.setMenu();
		this.run();
	}

	run() {
		this.overlayBackground = this.$header.attr('data-arts-header-overlay-background');
		this.stickyTheme = this.$stickyHeader.attr('data-arts-header-sticky-theme');

		if (typeof this.stickyScene !== 'undefined') {
			this.stickyScene.destroy(true);
		}

		this.timeline = new gsap.timeline();

		this._correctTopOffset();
		this._stick();
		this._bindEvents();
		this._handleAnchors();
	}

	setBurger(open = false) {
		if (open) {
			this.$header.addClass(this.openClass);
			this.$burger.addClass(this.burgerOpenClass);
		} else {
			this.$header.removeClass(this.openClass);
			this.$burger.removeClass(this.burgerOpenClass);
		}
	}

	setMenu() {

		if (this.$overlay.length) {
			gsap.set(this.$overlay, {
				autoAlpha: 0,
				display: 'none'
			});
		}
		if (this.$submenu.length) {
			gsap.set(this.$submenu, {
				autoAlpha: 0
			});
		}

		if (this.$submenuButton.length) {
			gsap.set(this.$submenuButton, {
				autoAlpha: 0
			});
		}

		this.$submenu.removeClass(this.openClass);
		this.$header.removeClass(this.openClass);
		this.$burger.removeClass(this.burgerOpenClass);

		if (this.$menuLinks.length) {
			gsap.effects.hideLines(this.$menuLinks, {
				autoAlpha: 1,
				y: '-100%',
				duration: 0,
			});
		}

		if (this.$submenuLinks.length) {
			gsap.effects.hideLines(this.$submenuLinks, {
				autoAlpha: 1,
				y: '-100%',
				duration: 0,
			});
		}

		if (this.$overlayWidgets.length) {
			gsap.effects.hideLines(this.$overlayWidgets, {
				autoAlpha: 1,
				y: this._isMediumScreen() ? '-100%' : '100%',
				duration: 0
			});
		}

		if (this.$curtain.length) {
			gsap.set(this.$curtain, {
				display: 'none'
			});
		}

	}

	openMenu() {
		return this.timeline
			.clear()
			.set(this.$curtain, {
				display: 'block',
			})
			.setCurtain(this.$curtain, {
				background: this.overlayBackground,
				y: '100%'
			})
			.set(this.$overlay, {
				autoAlpha: 1,
				display: 'flex'
			})
			.add([() => {
				this._setTransition(true);
				this._unstick();

			}])
			.set(this.$adminBar, {
				position: 'fixed',
			})
			.to(this.$headerLeft, {
				duration: 1.2,
				x: 30,
				autoAlpha: 0,
				ease: 'expo.inOut'
			}, 'start')
			.moveCurtain(this.$curtain, {
				duration: 1.2,
				y: '0%',
			}, 'start')
			.add(() => {
				this.$header.addClass(this.openClass);
			}, '-=0.6')
			.add([
				gsap.effects.animateLines(this.$menuLinks, {
					stagger: {
						amount: 0.2,
						from: 'end'
					},
					duration: 1.2,
					ease: 'power4.out'
				}),
				gsap.effects.animateLines(this.$overlayWidgets, {
					stagger: {
						amount: 0.2,
						from: this._isMediumScreen() ? 'end' : 'start'
					},
					duration: 1.2,
					ease: 'power4.out'
				})
			], '-=0.6')
			.add(() => {
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(window.theme.animations.timeScale.overlayMenuOpen || 1);
	}

	closeMenu(force = false, cb) {

		if (!this.$header.hasClass(this.openClass) && !force) {
			return this.timeline;
		}

		const
			$submenuLinksCurrent = this.$submenu.filter(`.${this.openClass}`).find(this.$submenuLinks);

		return this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				this._stick();

				if (typeof window.SB !== 'undefined' && window.SB.offset.y >= 1) {
					this.$stickyHeader.addClass(this.stickyClass);
				}
			})
			.to(this.$headerLeft, {
				duration: 1.2,
				x: 0,
				autoAlpha: 1,
				ease: 'expo.inOut'
			}, 'start')
			.to(this.$submenuButton, {
				x: -10,
				autoAlpha: 0,
				duration: 0.3,
				ease: 'expo.inOut'
			}, 'start')
			.moveCurtain(this.$curtain, {
				duration: 1.2,
				y: '-100%',
				curve: 'bottom'
			}, 'start')
			.add(() => {
				this.$header.removeClass(this.openClass);
			}, '-=0.9')
			.add(gsap.effects.hideLines([$submenuLinksCurrent, this.$menuLinks, this.$overlayWidgets], {
				stagger: {
					amount: 0,
					from: 'end'
				},
				y: '100%',
				duration: 0.6,
			}), 'start')
			.add(() => {
				this.$header.attr('data-arts-header-animation', '');
			}, '-=0.3')
			.add(() => {
				if (typeof cb === 'function') {
					cb();
				}
			}, '-=0.6')
			.add(() => {
				this.setMenu();
			})
			.timeScale(window.theme.animations.timeScale.overlayMenuClose || 1);
	}

	closeMenuTransition(force = false) {

		if (!this.$header.hasClass(this.openClass) && !force) {
			return this.timeline;
		}

		const
			$submenuLinksCurrent = this.$submenu.filter(`.${this.openClass}`).find(this.$submenuLinks);

		return this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				// Scroll.restoreScrollTop();
				this._stick();

				if (typeof window.SB !== 'undefined' && window.SB.offset.y >= 1) {
					this.$stickyHeader.addClass(this.stickyClass);
				}
			})
			.to(this.$headerLeft, {
				duration: 1.2,
				x: 0,
				autoAlpha: 1,
				ease: 'expo.inOut'
			}, 'start')
			.to(this.$submenuButton, {
				x: -10,
				autoAlpha: 0,
				duration: 0.3,
				ease: 'expo.inOut'
			}, 'start')
			.add(() => {
				this.$header.removeClass(this.openClass);
			}, '-=0.9')
			.add(gsap.effects.hideLines([$submenuLinksCurrent, this.$menuLinks, this.$overlayWidgets], {
				stagger: {
					amount: 0,
					from: 'end'
				},
				y: '100%',
				duration: 0.6,
			}), 'start')
			.add(() => {
				this.$header.attr('data-arts-header-animation', '');
			}, '-=0.3')
			.add(() => {
				this.setMenu();
			});
	}

	_bindEvents() {
		const self = this;

		if (this.$adminBar.length) {
			window.$window.on('resize', debounce(this._correctTopOffset, 250));
		}

		if (this.$burger.length) {
			this.$burger.off('click').on('click', (e) => {
				e.preventDefault();

				if (this._isInTransition()) {
					return;
				}

				if (this.$burger.hasClass(this.burgerOpenClass)) {
					this.closeMenu();
					this.$burger.removeClass(this.burgerOpenClass);
				} else {
					this.openMenu();
					this.$burger.addClass(this.burgerOpenClass);
				}
			});
		}

		if (this.$submenuOpeners.length) {
			this.$submenuOpeners.on('click', function (e) {

				if (self._isInTransition()) {
					e.preventDefault();
					return;
				}

				const
					$el = $(this),
					$currentMenu = $el.parents('ul'),
					$submenu = $el.next('.sub-menu');

				if ($submenu.length) {

					e.preventDefault();

					$el.addClass(self.linkSelectedClass);

					self._openSubmenu({
						submenu: $submenu,
						currentMenu: $currentMenu
					});
				}
			});
		}

		if (this.$submenuButton.length) {
			this.$submenuButton.on('click', (e) => {
				e.preventDefault();

				if (self._isInTransition()) {
					return;
				}

				const $submenu = this.$submenu.filter(`.${this.openClass}`),
					$prevMenu = $submenu.parent('li').parent('ul');

				self._closeSubmenu({
					submenu: $submenu,
					currentMenu: $prevMenu
				});
			});
		}

		window.$window
			.on('arts/preloader/end', () => {
				gsap.to(this.$headerColumns, {
					autoAlpha: 1,
					stagger: 0.2,
					duration: 0.6
				});
			})
			.on('arts/barba/transition/start', () => {
				this.$controls.addClass('pointer-events-none');
				this._unstick();
			})
			.on('arts/barba/transition/end', () => {
				this.$controls.removeClass('pointer-events-none');
			});
	}

	isOverlayOpened() {
		return this.$header.hasClass(this.openClass);
	}

	_isMediumScreen() {
		return window.Modernizr.mq('(max-width: 991px)');
	}

	_isInTransition() {
		return this.$header.attr('data-arts-header-animation') === 'intransition';
	}

	_setTransition(inTransition = true) {
		return this.$header.attr('data-arts-header-animation', inTransition ? 'intransition' : '');
	}

	_correctTopOffset() {
		const top = this.$adminBar.height() || 0;

		gsap.to(this.$header, {
			duration: 0.6,
			top
		});
	}

	_stick() {
		if (!this.$stickyHeader.length) {
			return;
		}

		this.stickyScene = new $.ScrollMagic.Scene({
				offset: '1px',
			})
			.setClassToggle(this.$stickyHeader, [this.stickyTheme, this.stickyClass].join(' '))
			.addTo(window.SMController);
	}

	_unstick() {
		if (!this.$stickyHeader.length || !this.stickyScene) {
			return;
		}

		this.stickyScene.destroy(true);
		this.stickyScene = undefined;
		this.$stickyHeader.removeClass(this.stickyClass);
	}

	_openSubmenu({
		submenu,
		currentMenu
	}) {
		const
			$currentLinks = currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = submenu.find('> li > a .menu-overlay__item-wrapper');

		this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				this.$submenu.removeClass(this.openClass);
				submenu.not(this.$menuOverlay).addClass(this.openClass);

				if (this.$submenu.hasClass(this.openClass)) {
					gsap.to(this.$submenuButton, {
						autoAlpha: 1,
						x: 0,
						duration: 0.3
					});

					if (this._isMediumScreen()) {
						gsap.effects.hideLines(this.$overlayWidgets, {
							stagger: {
								amount: 0.1,
								from: 'end'
							},
							y: '100%',
							duration: 1.2,
							ease: 'power4.out',
						});
					}
				} else {
					gsap.to(this.$submenuButton, {
						autoAlpha: 0,
						x: -10,
						duration: 0.3
					});

					gsap.effects.animateLines(this.$overlayWidgets, {
						stagger: {
							amount: 0.2,
							from: 'end'
						},
						duration: 1.2,
						ease: 'power4.out',
					});
				}
			})
			.set(submenu, {
				autoAlpha: 1,
				zIndex: 100
			})
			.add(gsap.effects.hideLines($currentLinks, {
				stagger: {
					amount: 0.2,
					from: 'end'
				},
				y: '100%',
				duration: 1.2,
				ease: 'power4.out'
			}))
			.add(gsap.effects.animateLines($submenuLinks, {
				stagger: {
					amount: 0.2,
					from: 'end'
				},
				duration: 1.2,
				ease: 'power4.out'
			}), '-=1.0')
			.add(() => {
				this.$menuLinks.removeClass(this.openClass);
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(1.25);
	}

	_closeSubmenu({
		submenu,
		currentMenu
	}) {
		const
			$currentLinks = currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = submenu.find('> li > a .menu-overlay__item-wrapper');

		this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				this.$submenu.removeClass(this.openClass);
				currentMenu.not(this.$menuOverlay).addClass(this.openClass);

				if (this.$submenu.hasClass(this.openClass)) {
					gsap.to(this.$submenuButton, {
						autoAlpha: 1,
						x: 0,
						duration: 0.3
					});

					if (this._isMediumScreen()) {
						gsap.effects.hideLines(this.$overlayWidgets, {
							stagger: {
								amount: 0.1,
								from: 'start'
							},
							y: '100%',
							duration: 1.2,
							ease: 'power4.out',
						});
					}
				} else {
					gsap.to(this.$submenuButton, {
						autoAlpha: 0,
						x: -10,
						duration: 0.3
					});

					gsap.effects.animateLines(this.$overlayWidgets, {
						stagger: {
							amount: 0.2,
							from: 'start'
						},
						duration: 1.2,
						ease: 'power4.out',
					});
				}
			})
			.set(submenu, {
				zIndex: -1
			})
			.add(gsap.effects.animateLines($currentLinks, {
				y: '100%',
				duration: 0
			}), 'start')
			.add(gsap.effects.hideLines($submenuLinks, {
				stagger: {
					amount: 0.1,
					from: 'start'
				},
				y: '-100%',
				duration: 1.2,
				ease: 'power4.out'
			}))
			.add(
				gsap.effects.animateLines($currentLinks, {
					stagger: {
						amount: 0.2,
						from: 'start'
					},
					duration: 1.2,
					ease: 'power4.out'
				}), '-=1.0')
			.set(submenu, {
				autoAlpha: 0,
			})
			.add(() => {
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(1.25);
	}

	_handleAnchors() {

		const self = this;

		// overlay anchor links
		this.$allLinksOverlay.filter('a[href*="#"]:not([href="#"])').off('click').each(function () {
			const
				$current = $(this),
				url = $current.attr('href');

			self._scrollToAnchorFromMenu({
				element: $current,
				url,
				menu: 'overlay'
			});
		});

		// regular menu anchor links
		this.$allLinksClassic.filter('a[href*="#"]:not([href="#"])').off('click').each(function () {
			const
				$current = $(this),
				url = $current.attr('href');

			self._scrollToAnchorFromMenu({
				element: $current,
				url,
				menu: 'classic'
			});
		});

	}

	_scrollToAnchorFromMenu({
		element,
		url,
		menu = 'classic'
	}) {
		if (!url || !element) {
			return;
		}

		const filteredUrl = url.substring(url.indexOf('#'));

		try {
			if (filteredUrl.length) {
				const $el = $(filteredUrl);

				if ($el.length) {

					element.on('click', () => {
						if (menu === 'classic') {
							Scroll.scrollTo({
								y: $el.offset().top - this.$header.innerHeight(),
								duration: 800
							});
						}

						if (menu === 'overlay') {
							this.closeMenu(false, () => {
								Scroll.scrollTo({
									y: $el.offset().top - this.$header.innerHeight(),
									duration: 800
								});
							});
						}
					});

				}
			}
		} catch (error) {
			console.error('Error when handling menu anchor links: ' + error);
		}
	}
}
