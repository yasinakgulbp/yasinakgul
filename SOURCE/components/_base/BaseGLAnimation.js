class BaseGLAnimation {

	constructor({
		target,
		canvas,
		aspect
	}) {
		this.target = target;
		this.canvas = canvas;

		if (!BaseGLAnimation.isThreeLoaded() || !this.canvas) {
			return false;
		}
		this.coverMode = aspect ? true : false;
		this.aspect = aspect || window.innerWidth / window.innerHeight;
		this.scene = this._getScene();
		this.viewport = this.coverMode ? this._getViewportCover() : this._getViewport();
		this.camera = this._getCamera();
		this.viewSize = this._getViewSize();
		this.position = this._calculatePosition();

		this.renderer = this._getRenderer();
		this.renderer.setPixelRatio(1); // window.devicePixelRatio
		this.renderer.setClearColor(0xffffff, 0.0);
		this.renderer.setSize(this.viewport.width, this.viewport.height);
		this.renderer.setAnimationLoop(this._render.bind(this));

		this.loader = this._getTextureLoader();

		this.camera.position.z = 1;
		this.camera.updateProjectionMatrix();
		this._updateScene();

		this._bindEvents();
	}

	_bindEvents() {
		window.$window.on('resize', debounce(() => {
			this._updateScene();
		}, 250));

		window.$window.on('arts/barba/transition/start', () => {
			this.destroy();
		});
	}

	_render() {
		this.renderer.render(this.scene, this.camera);
	}

	_getRenderer() {
		return new THREE.WebGLRenderer({
			canvas: this.canvas,
			powerPreference: 'high-performance',
			alpha: true
		});
	}

	_getScene() {
		return new THREE.Scene();
	}

	_getCamera() {
		return new THREE.PerspectiveCamera(
			53.1,
			this.viewport.aspectRatio,
			0.1,
			1000
		);
	}

	_getTextureLoader() {
		return new THREE.TextureLoader();
	}

	_getPlane({
		geometry,
		material
	}) {
		return new THREE.Mesh(geometry, material);
	}

	_updateScene() {
		this.viewport = this.coverMode ? this._getViewportCover() : this._getViewport();
		this.viewSize = this._getViewSize();
		this.camera.aspect = this.viewport.aspectRatio;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.viewport.width, this.viewport.height);
	}

	_getViewport() {

		const width = window.innerWidth;
		const height = window.innerHeight;
		const aspectRatio = width / height;

		return {
			width,
			height,
			aspectRatio
		}
	}

	_getViewportCover() {
		let
			height = parseFloat(window.innerHeight),
			width = parseFloat(height * this.aspect),
			aspectRatio = this.aspect,
			multiplier = 1

		if (this.aspect > 1) {
			multiplier = window.innerWidth > width ? window.innerWidth / width : 1;
		} else {
			multiplier = this.canvas.clientWidth / width;
		}

		if (multiplier < 1) {
			multiplier = 1;
		}

		width = width * multiplier;
		height = height * multiplier;

		return {
			width,
			height,
			aspectRatio
		};
	}

	_getViewSize() {
		// fit plane to screen
		// https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

		const distance = this.camera.position.z;
		const vFov = (this.camera.fov * Math.PI) / 180;
		const height = 2 * Math.tan(vFov / 2) * distance;
		const width = height * this.viewport.aspectRatio;

		return {
			width,
			height,
			vFov
		};
	}

	_calculatePosition() {
		let
			height = parseFloat(window.innerHeight),
			width = parseFloat(height * this.viewport.aspectRatio),
			multiplier = 1;

		if (this.viewport.aspectRatio > 1) {
			multiplier = window.innerWidth > width ? window.innerWidth / width : 1;
		} else {
			multiplier = this.canvas.clientWidth / width;
		}

		if (multiplier < 1) {
			multiplier = 1;
		}

		width = width * multiplier;
		height = height * multiplier;

		return {
			width,
			height
		};
	}

	_loadTextures() {
		const self = this,
			promises = [];

		this.items.each(function (index) {
			const url = $(this).find('[data-texture-src]').attr('data-texture-src');

			promises.push(
				self._loadTexture({
					loader: self.loader,
					url,
					index
				})
			);
		});

		return new Promise((resolve, reject) => {
			// resolve textures promises
			Promise.all(promises).then(promises => {
				// all textures are loaded
				promises.forEach((promise, index) => {
					const $img = $(this.items[index]).find('[data-texture-src]');
					// assign texture to item
					this.items[index].texture = promise.texture;
					this.items[index].texture.magFilter = THREE.LinearFilter;
					this.items[index].texture.minFilter = THREE.LinearFilter;
					this.items[index].texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

					if ($img.is('img')) {
						// load texture back to src (needed for AJAX transition)
						$img.attr('src', $img.attr('data-texture-src'));
					}
				});

				resolve();
			});
		});
	}

	_loadTexture({
		loader,
		url,
		index
	}) {
		// https://threejs.org/docs/#api/en/loaders/TextureLoader
		return new Promise((resolve, reject) => {
			if (!url) {
				resolve({
					texture: null,
					index
				});
				return;
			}
			// load a resource
			loader.load(
				// resource URL
				url,

				// onLoad callback
				texture => {
					resolve({
						texture,
						index
					});
				},

				// onProgress callback currently not supported
				undefined,

				// onError callback
				error => {
					console.error('An error happened during loading a texture to the canvas.', error);
					reject(error);
				}
			)
		})
	}

	_getVertexShader(id) {
		return document.getElementById(id).textContent || false;
	}

	_getFragmentShader(id) {
		return document.getElementById(id).textContent || false;
	}

	static isThreeLoaded() {
		return (typeof window.THREE === 'object');
	}

	destroy() {
		this.renderer.setAnimationLoop(null);
		this.camera = undefined;
		this.scene = undefined;
		this.loader = undefined;
		this.material = undefined;
		// this.renderer = undefined;
		window.$window.off('resize');
	}
}
