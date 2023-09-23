function PJAXUpdateBody(data) {
	return new Promise((resolve) => {
		const
			regexp = /\<body.*\sclass=["'](.+?)["'].*\>/gi,
			match = regexp.exec(data.next.html);

		if (!match || !match[1]) {
			resolve(true);
			return;
		}

		document.body.setAttribute('class', match[1]);
		resolve(true);
	});
}
