class GMap extends BaseComponent {
	constructor({
		scope,
		target
	}) {
		super({
			scope,
			target
		});
	}

	set() {
		this.prevInfoWindow = false;
		this.$container = this.$target.find('.gmap__container');
		this.$markers = this.$target.find('.gmap__marker');

		this.zoom = parseInt(this.$target.data('gmap-zoom'));
		this.styles = this._parseStyles(this.$target.attr('data-gmap-snazzy-styles'));
	}

	run() {
		if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined' && this.$container.length) {
			this._createMap();
		}
	}

	_parseStyles(styles) {
		if (!styles) {
			return false;
		}

		try {
			return JSON.parse(styles);
		} catch (err) {
			console.error('Google Map: Invalid Snazzy Styles Array!');
			return false;
		}
	}

	_createMap() {

		const
			self = this,
			argsMap = {
				center: new google.maps.LatLng(0, 0),
				zoom: this.zoom,
				scrollwheel: false
			};

		if (this.styles) {
			$.extend(argsMap, {
				styles: this.styles
			});
		}

		this.map = new google.maps.Map(this.$container[0], argsMap);
		this.map.markers = [];

		this.$markers.each(function () {
			self._createMarker($(this));
		});

		this._centerMap(this.zoom);
	}

	_createMarker($marker) {

		if (!$marker.length) {
			return;
		}

		const
			MARKER_LAT = parseFloat($marker.attr('data-marker-lat')),
			MARKER_LON = parseFloat($marker.attr('data-marker-lon')),
			MARKER_IMG = $marker.attr('data-marker-img'),
			MARKER_WIDTH = $marker.attr('data-marker-width'),
			MARKER_HEIGHT = $marker.attr('data-marker-height'),
			MARKER_CONTENT = $marker.attr('data-marker-content');

		let marker;

		/**
		 * Marker
		 */
		const argsMarker = {
			position: new google.maps.LatLng(MARKER_LAT, MARKER_LON),
			map: this.map
		};

		if (MARKER_IMG) {
			$.extend(argsMarker, {
				icon: {
					url: MARKER_IMG
				}
			});
		}

		if (MARKER_IMG && MARKER_WIDTH && MARKER_HEIGHT) {
			$.extend(argsMarker.icon, {
				scaledSize: new google.maps.Size(MARKER_WIDTH, MARKER_HEIGHT)
			});
		}

		marker = new google.maps.Marker(argsMarker);
		this.map.markers.push(marker);

		/**
		 * Info Window (Content)
		 */
		this._createInfoWindow({
			marker,
			content: MARKER_CONTENT
		});

	}

	_createInfoWindow({
		marker,
		content = ''
	}) {
		if (content) {
			const infoWindow = new google.maps.InfoWindow({
				content: content
			});

			marker.addListener('click', () => {
				if (this.prevInfoWindow) {
					this.prevInfoWindow.close();
				}

				this.prevInfoWindow = infoWindow;

				infoWindow.open(this.map, marker);
			});
		}
	}

	_centerMap(zoom) {
		const bounds = new google.maps.LatLngBounds();

		$.each(this.map.markers, function () {
			const item = this;

			if (typeof item.position !== 'undefined') {

				const
					lat = item.position.lat(),
					lng = item.position.lng(),
					newZoom = new google.maps.LatLng(lat, lng);

				bounds.extend(newZoom);
			}
		});

		// center single marker
		if (this.map.markers.length == 1) {
			this.map.setCenter(bounds.getCenter());
			this.map.setZoom(zoom);
		} else { // fit bounds to multiple markers
			this.map.fitBounds(bounds);
		}
	}
}
