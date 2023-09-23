/**
 * Try to use high performance GPU on dual-GPU systems
 */
runOnHighPerformanceGPU();

/**
 * Use passive listeners to improve scrolling performance
 */
jQuery.event.special.touchstart = {
	setup: function (_, ns, handle) {
		if (ns.includes('noPreventDefault')) {
			this.addEventListener('touchstart', handle, {
				passive: false
			});
		} else {
			this.addEventListener('touchstart', handle, {
				passive: true
			});
		}
	}
};

jQuery.event.special.touchend = {
	setup: function (_, ns, handle) {
		if (ns.includes('noPreventDefault')) {
			this.addEventListener('touchend', handle, {
				passive: false
			});
		} else {
			this.addEventListener('touchend', handle, {
				passive: true
			});
		}
	}
};

/**
 * Extend default easing functions set
 */
jQuery.extend(jQuery.easing, {
	easeInOutExpo: function (x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
});

/**
 * GSAP: turn off console warnings
 */
gsap.config({
	nullTargetWarn: false
});

/**
 * Global Vars
 */
window.$document = $(document);
window.$window = $(window);
window.$body = $('body');
window.$html = $('html');
window.$spinner = $('#js-spinner');
window.$barbaWrapper = $('[data-barba="wrapper"]');
window.$pageWrapper = $('#page-wrapper');
window.$pageContent = $('.page-wrapper__content');
window.$pagePreloader = $('#js-preloader');
window.PagePreloader = new Preloader({
	scope: window.$document,
	target: window.$pagePreloader,
	curtain: {
		element: $('#js-page-transition-curtain'),
		background: $('.section-masthead').attr('data-background-color')
	},
	counter: {
		easing: 'power4.out',
		duration: 25,
		start: 0,
		target: 100,
		prefix: '',
		suffix: ''
	}
});

/**
 * Begin Page Load
 */
window.PagePreloader.start();

/**
 * Default Theme Options
 * Used to prevent errors if there is
 * no data provided from backend
 */
if (typeof window.theme === 'undefined') {
	window.theme = {
		ajax: {
			enabled: true,
			preventRules: '' // jQuery selectors of the elements to exclude them from AJAX transitions
		},
		animations: {
			triggerHook: 0.85, // more info https://scrollmagic.io/docs/ScrollMagic.Scene.html#triggerHook
			timeScale: {
				onScrollReveal: 1, // on-scroll animations global speed
				overlayMenuOpen: 1, // fullscreen menu open speed
				overlayMenuClose: 1, // fullscreen menu close speed
			}
		},
		cursorFollower: {
			enabled: true,
			labels: {
				slider: 'Drag'
			}
		},
		smoothScroll: { // more info https://github.com/idiotWu/smooth-scrollbar/tree/develop/docs
			enabled: true,
			damping: 0.12,
			renderByPixels: true,
			continuousScrolling: false,
			plugins: {
				edgeEasing: true
			}
		},
		contactForm7: {
			customModals: true
		}
	}
}

/**
 * ScrollMagic Setup
 */
window.SMController = new ScrollMagic.Controller();
window.SMController.enabled(false); // don't start animations yet
window.SMSceneTriggerHook = window.theme.animations.triggerHook;
window.SMSceneReverse = false;

/**
 * Don't save scroll position
 * after AJAX transition
 */
if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

/**
 * Page Load Strategy
 */
window.$window.on('load', function () {

	new Animations();

	// load fonts first
	document.fonts.ready
		// prepare all the texts
		.then(() => SetText.splitText({
			target: window.$document.find('.js-split-text')
		}))
		.then(() => SetText.setLines({
			target: window.$document.find('.split-text[data-split-text-set="lines"]')
		}))
		.then(() => SetText.setWords({
			target: window.$document.find('.split-text[data-split-text-set="words"]')
		}))
		.then(() => SetText.setChars({
			target: window.$document.find('.split-text[data-split-text-set="chars"]')
		}))
		// init template components
		.then(() => {
			initComponentsOnce({
				scope: window.$document
			});

			initComponents({
				scope: window.$document
			});
		})
		.then(() => window.PagePreloader.finish())
		.then(() => {
			// init cursor only on non-touch browsers
			if (window.theme.cursorFollower.enabled && !window.Modernizr.touchevents) {
				new Cursor({
					scope: window.$document,
					target: $('#js-cursor'),
					cursorElements: '[data-arts-cursor]',
					highlightElements: 'a:not(a[data-arts-cursor]):not(.social__item a):not(.section-video__link):not(.no-highlight), button:not(button[data-arts-cursor]), .filter__item, .section-nav-projects__header', // links to highlight
					highlightScale: 1.5, // default highlight scaling
					magneticElements: '[data-arts-cursor-magnetic]', // magnetic elements 
					magneticScaleCursorBy: 1.3, // default magnetic scaling
					animDuration: 0.25,
				});
			}
			// begin animations 
			window.SMController.enabled(true);
			window.SMController.update(true);
		});

	// init AJAX navigation
	if (window.theme.ajax.enabled) {
		new PJAX({
			target: window.$barbaWrapper,
			scope: window.$document
		});
	}

});

/**
 * Init Template Components after the initial
 * load and after an AJAX transition happens.
 * 
 * You can init your custom scripts here
 * in that function
 */
function initComponents({
	scope = window.$document,
	container = window.$pageWrapper,
	scrollToHashElement = true
}) {

	// init page header one time only
	if (typeof window.theme.header === 'undefined') {
		window.theme.header = new Header();
	}

	new MobileBarHeight();
	new SmoothScroll({
		target: container.filter('.js-smooth-scroll'),
		adminBar: $('#wpadminbar'),
		absoluteElements: $('[data-arts-scroll-absolute]'), // correct handling of absolute elements OUTSIDE scrolling container
		fixedElements: $('[data-arts-scroll-fixed]') // correct handling of fixed elements INSIDE scrolling container
	});
	new ScrollDown({
		target: scope.find('[data-arts-scroll-down]'),
		scope,
		duration: 0.8
	})
	new ArtsParallax({
		target: scope.find('[data-arts-parallax]'),
		factor: 0.3,
		ScrollMagicController: window.SMController,
		SmoothScrollBarController: window.SB
	});
	new AsideCounters({
		target: scope.find('.aside-counters'),
		scope
	});
	new Arrow({
		target: scope.find('.js-arrow')
	});
	new SectionMasthead({
		target: scope.find('.section-masthead'),
		scope
	});
	new SectionContent({
		target: scope.find('.section-content'),
		scope
	});
	new SectionProjectsSlider({
		target: scope.find('.section-projects-slider'),
		scope
	});
	new SectionList({
		target: scope.find('.section-list'),
		scope
	});
	new ChangeTextHover({
		target: scope.find('.js-change-text-hover:not(.js-change-text-hover .js-change-text-hover)'), // exclude nested elements
		scope,
		pageIndicator: scope.find('.js-page-indicator'), // fixed page indicator
		triggers: scope.find('.js-page-indicator-trigger'), // elements that triggers the change of page indicator
	});
	new PageIndicator(scope);
	new PSWPGallery({
		target: scope.find('.js-gallery'),
		scope,
		options: { // Pass your custom PhotoSwipe options here https://photoswipe.com/documentation/options.html
			history: window.theme.ajax.enabled ? false : true, // galleries URLs navigation is NOT compatible with AJAX
			showAnimationDuration: 300,
		}
	});
	new PSWPAlbum({
		target: scope.find('.js-album'),
		scope,
		options: { // Pass your custom PhotoSwipe options here https://photoswipe.com/documentation/options.html
			history: window.theme.ajax.enabled ? false : true, // galleries URLs navigation is NOT compatible with AJAX
			showAnimationDuration: 300,
		}
	});
	new GMap({
		target: scope.find('.js-gmap'),
		scope
	});
	new Form({
		target: scope,
		scope
	});
	new FormAJAX({
		target: scope.find('.js-ajax-form'),
		scope
	});
	new SectionSliderImages({
		target: scope.find('.section-slider-images'),
		scope
	});
	new SectionTestimonials({
		target: scope.find('.section-testimonials'),
		scope
	});
	new SectionGrid({
		target: scope.find('.section-grid'),
		scope
	});

	new SectionNavProjects({
		target: scope.find('.section-nav-projects'),
		scope
	});

	new CircleButton({
		target: scope.find('.js-circle-button:not(.js-circle-button_curved)'),
		scope
	});

	new SectionScroll({
		target: scope.find('.section-scroll'),
		scope
	});

	// scroll to anchor from URL hash
	if (scrollToHashElement) {
		Scroll.scrollToAnchorFromHash(2600);
	}

	//
	// your custom plugins init here
	//

}

/**
 * Init Template Components
 * only once after the initial
 * page load
 */
function initComponentsOnce({
	scope = window.$document,
	container = window.$pageWrapper
}) {
	window.theme.header = new Header();

	new LazyLoad({
		scope: window.$document,
		setPaddingBottom: true,
		run: true
	});
}
