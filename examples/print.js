function init () {
	var map,
	    printProvider,
	    printControl,
	    ll = new L.LatLng(-36.852668, 174.762675);
	
	map = L.map('map', {
		center: ll,
		zoom: 15
	});

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Add a marker to the map
	L.marker(ll).addTo(map);

	// Create the print provider, subscribing to print events
	printProvider = L.print.provider({
		autoLoad: true,
		proxy: 'proxy.php?url=',
		url: 'http://apps2.geosmart.co.nz/mapfish-print/pdf/',
		dpi: 254,
		outputFormat: 'png',
		customParams: {
			mapTitle: 'Print Test',
			comment: 'Testing Leaflet printing'
		},
		listeners: {
			beforeprint: function () {
				map.spin(true);
			},
			print: function () {
				map.spin(false);
			},
			printexception: function () {
				map.spin(false);
			}
		}
	});

	// Create a print control with the configured
	// provider and add to the map
	printControl = L.control.print({
		provider: printProvider
	});        

	map.addControl(printControl);
}

$(document).ready(init);

