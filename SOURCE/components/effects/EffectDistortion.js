class EffectDistortion extends BaseGLAnimation {
	constructor({
		slider,
		canvas,
		aspect = 1.5,
		displacementImage,
		items,
	}) {
		super({
			canvas,
			aspect
		});

		this.aspect = aspect;
		this.canvas = canvas;
		this.dispImage = displacementImage;
		this.items = items;
		this.slider = slider;
		this.textures = [];
		this.timeline = new gsap.timeline();

		this.disp = this.loader.load(this.dispImage);
		this.disp.wrapS = this.disp.wrapT = THREE.RepeatWrapping;

		this.scene = this._getScene();
		this.viewport = this._getViewport();
		this.camera = this._getCamera();

		this.uniforms = {
			effectFactor: {
				type: "f",
			},
			dispFactor: {
				type: "f",
				value: 0.0
			},
			texture: {
				type: "t",
				value: this.items[0].texture
			},
			texture2: {
				type: "t",
				value: this.items[1].texture
			},
			disp: {
				type: "t",
				value: this.disp
			}
		};
		this.geometry = this._getPlaneBufferGeometry();
		this.material = this._getShaderMaterial();
		this.plane = this._getPlane({
			geometry: this.geometry,
			material: this.material
		});
		this.scene.add(this.plane);
		this.initialProgress = 0;
		this.progress = 0;

		this.camera.position.z = 1;
		this.camera.updateProjectionMatrix();
		this._updateScene();

		this._loadTextures().then(() => {
			this.isLoaded = true;

			if (window.$pagePreloader && window.$pagePreloader.length && window.$pagePreloader.is(':visible')) {
				window.$window.on('arts/preloader/end', () => {
					this._animateInitial();
				});
			} else {
				this._animateInitial();
			}
		});
	}

	_animateInitial(delay = 0) {
		this.change({
			from: this.slider.realIndex,
			to: this.slider.realIndex,
			delay,
			speed: parseFloat(this.slider.params.speed / 1000),
			onComplete: () => {
				let nextIndex = 1;

				if (this.slider.realIndex >= this.slider.slides.length - 1) {
					nextIndex = 1;
				} else {
					nextIndex = this.slider.realIndex + 1;
				}

				this.material.uniforms.texture.value = this.items[nextIndex].texture;
				if (this.slider.params.mousewheel.enabled) {
					this.slider.mousewheel.enable();
				}
				if (this.slider.params.keyboard.enabled) {
					this.slider.keyboard.enable();
				}
			}
		});
	}

	_getPlaneBufferGeometry() {
		const {
			width,
			height
		} = this._calculatePosition();

		return new THREE.PlaneBufferGeometry(
			width,
			height,
			this.aspect
		);
	}

	_getCamera() {
		const {
			width,
			height
		} = this._calculatePosition();

		return new THREE.OrthographicCamera(
			width / -2,
			width / 2,
			height / 2,
			height / -2,
		);
	}

	_getShaderMaterial() {
		const fsID = this.slider.params.direction === 'horizontal' ? 'slider-textures-horizontal-fs' : 'slider-textures-vertical-fs';

		return new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: this._getVertexShader('slider-textures-vs'),
			fragmentShader: this._getFragmentShader(fsID),
			opacity: 1
		});
	}

	change({
		from = 0,
		to = 0,
		speed = 1.2,
		intensity = 0.25,
		delay = 0,
		ease = 'power3.out',
		onComplete,
	}) {

		if (!this.material) {
			return false;
		}

		this.material.uniforms.texture.value = this.items[from].texture;
		this.material.uniforms.texture2.value = this.items[to].texture;
		this.material.uniforms.effectFactor.value = intensity;

		this.timeline.fromTo(this.material.uniforms.dispFactor, {
			value: 0
		}, {
			value: 1,
			ease: ease,
			duration: speed,
			delay,
			onComplete: () => {
				if (typeof onComplete === 'function') {
					onComplete();
				}
			}
		});
	}
}
