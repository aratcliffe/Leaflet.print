var deps = {
	PrintProvider: {
		src: [
			'print.Provider.js'
		],
		desc: 'Provides an interface to either a Mapfish or GeoServer print module.'
	},

	ControlPrint: {
		src: [
			'Control.Print.js'
		],
		desc: 'Print control.',
		deps: ['PrintProvider']
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
