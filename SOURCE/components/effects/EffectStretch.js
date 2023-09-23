class EffectStretch extends BaseGLAnimation {
	constructor({
		target,
		canvas,
		items,
		options
	}) {
		super({
			target,
			canvas,
		});

		if (!items.length) {
			return;
		}

		this.items = items;
		this.tempItemIndex = null;

		this.options = options || {
			strength: 0.2,
			scaleTexture: 1.8,
			scalePlane: 1
		};

		this.mouse = new THREE.Vector2();
		this.position = new THREE.Vector3(0, 0, 0);
		this.scale = new THREE.Vector3(1, 1, 1);

		this.uniforms = {
			uTexture: {
				value: null
			},
			uOffset: {
				value: new THREE.Vector2(0.0, 0.0)
			},
			uAlpha: {
				value: 0
			},
			uScale: {
				value: Math.abs(this.options.scaleTexture - 2)
			}
		};
		this.geometry = this._getPlaneBufferGeometry();
		this.material = this._getShaderMaterial();
		this.plane = this._getPlane({
			geometry: this.geometry,
			material: this.material
		});
		this.scene.add(this.plane);

		this._loadTextures().then(() => {
			this.isLoaded = true;
			target.removeClass('pointer-events-none');
		});
		this._bindMouseEvents();
	}

	_bindMouseEvents() {
		const self = this;

		this.items.each(function (index) {
			$(this)
				.on('mouseenter', (event) => {
					if (!self.isLoaded) {
						return;
					}

					self.tempItemIndex = index;
					self._onMouseEnter();
					if (self.currentItem && self.currentItem.index === index) {
						return;
					}

					self._onTargetChange(index);
				})
				.on('mouseleave', (event) => {
					if (!self.isLoaded) {
						return;
					}

					self.isMouseOver = false;
					self._onMouseLeave(event);
				});
		});

		window.$window.on('mousemove touchmove', (event) => {
			if (event.type !== 'touchmove') {
				this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1;
				this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1;
				this._onMouseMove(event);
			}
		});
	}

	_getPlaneBufferGeometry() {
		return new THREE.PlaneBufferGeometry(1, 1, 8, 8);
	}

	_getShaderMaterial() {
		return new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: this._getVertexShader('list-hover-vs'),
			fragmentShader: this._getFragmentShader('list-hover-fs'),
			transparent: true
		});
	}

	_onMouseEnter() {
		if (!this.currentItem || !this.isMouseOver) {
			this.isMouseOver = true;
			// show plane
			gsap.to(this.uniforms.uAlpha, {
				duration: 0.3,
				value: 1,
				ease: 'power4.out'
			});
		}
	}

	_onMouseLeave() {
		gsap.to(this.uniforms.uAlpha, {
			duration: 0.3,
			value: 0,
			ease: 'power4.out'
		});
	}

	_onMouseMove() {
		// project mouse position to world coodinates
		let x = this.mouse.x.map(
			-1,
			1,
			-this.viewSize.width / 2,
			this.viewSize.width / 2
		);
		let y = this.mouse.y.map(
			-1,
			1,
			-this.viewSize.height / 2,
			this.viewSize.height / 2
		);

		// update position
		this.position = new THREE.Vector3(x, y, 0);

		gsap.to(this.plane.position, {
			duration: 1,
			x: x,
			y: y,
			ease: 'power4.out',
			onUpdate: this._onPositionUpdate.bind(this)
		});
	}

	_onPositionUpdate() {
		// compute offset
		let offset = this.plane.position
			.clone()
			.sub(this.position)
			.multiplyScalar(-this.options.strength);

		this.uniforms.uOffset.value = offset;
	}

	_onTargetChange(index) {
		// item target changed
		this.currentItem = this.items[index];
		if (!this.currentItem.texture) {
			return;
		}

		// compute image ratio
		const imageRatio = this.currentItem.texture.image.naturalWidth / this.currentItem.texture.image.naturalHeight;

		this.scale = new THREE.Vector3(imageRatio * this.options.scalePlane, 1 * this.options.scalePlane, 1 * this.options.scalePlane);
		this.uniforms.uTexture.value = this.currentItem.texture;
		this.plane.scale.copy(this.scale);
	}
}
