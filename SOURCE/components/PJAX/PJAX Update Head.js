function PJAXUpdateHead(data) {
	return new Promise((resolve) => {
		const
			head = document.head,
			newPageRawHead = data.next.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0],
			newPageHead = document.createElement('head');

		newPageHead.innerHTML = newPageRawHead;

		const headTags = [
			'meta[name="keywords"]',
			'meta[name="description"]',
			'meta[property^="og"]',
			'meta[name^="twitter"]',
			'meta[itemprop]',
			'link[itemprop]',
			'link[rel="prev"]',
			'link[rel="next"]',
			'link[rel="canonical"]',
			'link[rel="alternate"]',
			'link[rel="shortlink"]',
			'link[id*="elementor"]',
			'link[id*="eael"]', // Essential Addons plugin post CSS
			'style[id*="elementor"]',
			'style[id*="eael"]', // Essential Addons plugin inline CSS
		].join(',');

		const
			oldHeadTags = head.querySelectorAll(headTags),
			newHeadTags = newPageHead.querySelectorAll(headTags),
			newStylesLoaded = [];

		let pageStyles = document.querySelectorAll('link[rel="stylesheet"]');

		// flag all current page styles as loaded
		for (let i = 0; i < pageStyles.length; i++) {
			pageStyles[i].isLoaded = true;
		}

		// append new and remove old tags
		for (let i = 0; i < newHeadTags.length; i++) {
			if (typeof oldHeadTags[i] !== 'undefined') {
				head.insertBefore(newHeadTags[i], oldHeadTags[i].nextElementSibling);
				head.removeChild(oldHeadTags[i]);
			} else {
				head.insertBefore(newHeadTags[i], newHeadTags[i - 1]);
			}
		}

		// page now has new styles
		pageStyles = document.querySelectorAll('link[rel="stylesheet"]');

		// listen for 'load' only on elements which are not loaded yet
		for (let i = 0; i < pageStyles.length; i++) {
			if (!pageStyles[i].isLoaded) {
				const promise = new Promise((resolve) => {
					pageStyles[i].addEventListener('load', () => {
						resolve(true);
					});
				});

				newStylesLoaded.push(promise);
			}
		}

		// load all new page styles
		Promise.all(newStylesLoaded).then(() => {
			resolve(true);
		});
	});
}
