/*global L:false*/

L.Control.Print = L.Control.extend({

	options: {
		position: 'topleft',
		showLayouts: true
	},

	initialize: function (options) {
		L.Control.prototype.initialize.call(this, options);

		this._actionButtons = {};
		this._actionsVisible = false;

		if (this.options.provider && this.options.provider instanceof L.print.Provider) {
			this._provider = this.options.provider;
		} else {
			this._provider = L.print.Provider(this.options.provider || {});
		}
	},

	onAdd: function (map) {
		var capabilities,
		    container = L.DomUtil.create('div', 'leaflet-control-print'),
		    toolbarContainer = L.DomUtil.create('div', 'leaflet-bar', container),
		    link;

		this._toolbarContainer = toolbarContainer;

		link = L.DomUtil.create('a', 'leaflet-print-print', toolbarContainer);
		link.href = '#';
		link.title = 'Print map';

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'mousedown', L.DomEvent.stopPropagation)
			.on(link, 'dblclick', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', this.onPrint, this);

		if (this.options.showLayouts) {
			capabilities = this._provider.getCapabilities();
			if (!capabilities) {
				this._provider.once('capabilitiesload', this.onCapabilitiesLoad, this);
			} else {
				this._createActions(container, capabilities);
			}
		}

		this._provider.setMap(map);

		return container;
	},

	onRemove: function () {
		var buttonId,
		    button;

		for (buttonId in this._actionButtons) {
			if (this._actionButtons.hasOwnProperty(buttonId)) {
				button = this._actionButtons[buttonId];
				this._disposeButton(button.button, button.callback, button.scope);
			}
		}

		this._actionButtons = {};
		this._actionsContainer = null;
	},

	getProvider: function () {
		return this._provider;
	},

	_createActions: function (container, capabilities) {
		var layouts = capabilities.layouts,
		    l = layouts.length,
		    actionsContainer = L.DomUtil.create('ul', 'leaflet-print-actions', container),
		    buttonWidth = 100,
		    containerWidth = (l * buttonWidth) + (l - 1),
		    button,
		    li,
		    i;

		actionsContainer.style.width = containerWidth + 'px';

		for (i = 0; i < l; i++) {
			li = L.DomUtil.create('li', '', actionsContainer);

			button = this._createButton({
				title: 'Print map using the ' + layouts[i].name + ' layout',
				text: this._ellipsis(layouts[i].name, 16),
				container: li,
				callback: this.onActionClick,
				context: this
			});

			this._actionButtons[L.stamp(button)] = {
				name: layouts[i].name,
				button: button,
				callback: this.onActionClick,
				context: this
			};
		}

		this._actionsContainer = actionsContainer;
	},

	_createButton: function (options) {
		var link = L.DomUtil.create('a', options.className || '', options.container);
		link.href = '#';

		if (options.text) {
			link.innerHTML = options.text;
		}

		if (options.title) {
			link.title = options.title;
		}

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'mousedown', L.DomEvent.stopPropagation)
			.on(link, 'dblclick', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', options.callback, options.context);

		return link;
	},

	_showActionsToolbar: function () {
		L.DomUtil.addClass(this._toolbarContainer, 'leaflet-print-actions-visible');
		this._actionsContainer.style.display = 'block';

		this._actionsVisible = true;
	},

	_hideActionsToolbar: function () {
		this._actionsContainer.style.display = 'none';
		L.DomUtil.removeClass(this._toolbarContainer, 'leaflet-print-actions-visible');

		this._actionsVisible = false;
	},

	_ellipsis: function (value, len) {
		if (value && value.length > len) {
			value = value.substr(0, len - 3) + '...';
		}
		return value;
	},

	// --------------------------------------------------
	// Event Handlers
	// --------------------------------------------------

	onCapabilitiesLoad: function (event) {
		this._createActions(this._container, event.capabilities);
	},

	onActionClick: function (event) {
		var id = '' + L.stamp(event.target),
		    button,
		    buttonId;

		for (buttonId in this._actionButtons) {
			if (this._actionButtons.hasOwnProperty(buttonId) && buttonId === id) {
				button = this._actionButtons[buttonId];
				this._provider.print({
					layout: button.name
				});
				break;
			}
		}
		this._hideActionsToolbar();
	},

	onPrint: function () {
		if (this.options.showLayouts) {
			if (!this._actionsVisible) {
				this._showActionsToolbar();
			} else {
				this._hideActionsToolbar();
			}
		} else {
			this._provider.print();
		}
	}
});

L.control.print = function (options) {
	return new L.Control.Print(options);
};
