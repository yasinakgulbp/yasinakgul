function PJAXInitNewPage(data) {
	return new Promise((resolve) => {
		const
			promises = [
				PJAXUpdateBody(data),
				PJAXUpdateNodes(data),
				PJAXUpdateHead(data)
			],
			$nextContainer = $(data.next.container);

		return Promise
			.all(promises)
			.then(() => document.fonts.ready)
			.then(() => SetText.splitText({
				target: $nextContainer.find('.js-split-text')
			}))
			.then(() => SetText.setLines({
				target: $nextContainer.find('.split-text[data-split-text-set="lines"]')
			}))
			.then(() => SetText.setWords({
				target: $nextContainer.find('.split-text[data-split-text-set="words"]')
			}))
			.then(() => SetText.setChars({
				target: $nextContainer.find('.split-text[data-split-text-set="chars"]')
			}))
			.then(() => {
				// re-init Contact Form 7
				if (typeof wpcf7 !== 'undefined') {
					wpcf7.initForm(jQuery('.wpcf7-form'));
				}

				// scroll at the page beginning
				Scroll.scrollToTop();

				// load images
				new LazyLoad({
					scope: $nextContainer,
					setPaddingBottom: true,
					run: true
				});

				// clear & re-init ScrollMagic
				window.SMController.destroy();
				window.SMController = null;
				window.SMController = new ScrollMagic.Controller();

				// Transition init new page event (before components init)
				window.dispatchEvent(new CustomEvent('arts/barba/transition/init/before'));

				// re-init components
				initComponents({
					scope: $nextContainer,
					container: $nextContainer,
					scrollToHashElement: false // will scroll to the anchors later once transition is fully finished
				});

				// don't start animations immediately
				window.SMController.enabled(false);

				// ensure that scroll is still locked
				Scroll.lock(true);

				// Transition init new page event (after components init)
				window.dispatchEvent(new CustomEvent('arts/barba/transition/init/after'));

				// update ad trackers
				PJAXUpdateTrackers();

				resolve(true);
			});
	});
}
