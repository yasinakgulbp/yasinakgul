function runOnHighPerformanceGPU() {
	const webGLCanvas = document.getElementById('js-webgl');

	if (typeof webGLCanvas !== 'undefined' && webGLCanvas !== null) {
		webGLCanvas.getContext('webgl', {
			powerPreference: 'high-performance'
		});
	}
}
