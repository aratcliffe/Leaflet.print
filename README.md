#Leaflet.print
==============
Implements the Mapfish print protocol allowing a Leaflet map to be printed using either the [Mapfish](https://github.com/mapfish/mapfish-print) or [GeoServer](http://geoserver.org) print module.

This plugin is inspired by the printing features of the [GeoExt]( http://geoext.org/lib/GeoExt/data/PrintProvider.html) library. It also borrows from the visual style of the [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw) plugin.

Currently the following layer types are supported:

* Marker
* TileLayer
* TileLayer.WMS
* Mapbox.TileLayer
* ImageOverlay
* Polyline
* MultiPolyline
* Polygon
* MultiPolygon
* Circle

*Requires Leaflet 0.6.0 or newer and jQuery.*

##Using the plugin

The plugin consists of a print provider, which implements the protocol used by the MapFish print module and optionally loads the service capabilities document, and a map control that prints the current map view using the user's choice of document layout.

###Usage
Create a print provider, optionally create a print control and add it to the map.

```javascript
var printProvider = L.print.provider({
   method: 'GET',
   url: ' http://path/to/mapfish/print',
   autoLoad: true,
   dpi: 90
});

var printControl = L.control.print({
   provider: printProvider
});        
map.addControl(printControl);

```

###All Options
Print Provider Options:

| Option | Type | Default | Description
| --- | --- | --- | ---
| map | [L.Map](http://leafletjs.com/reference.html#map-class) | `undefined` | The map that will be printed. Not required if using with the print control.
| url | String | `undefined` | The base url for the print service. Only required if `capabilities` is not provided. This is usually something like `http://path/to/mapfish/print` for Mapfish, and `http://path/to/geoserver/pdf` for GeoServer with the printing extension installed.|
| proxy | String | `undefined` | Url for a local resource that will proxy the request for the print service. The print service url will be passed as the "url" parameter on the request.
| method| String | `'POST'` | The HTTP method to use to request the printed map.
| autoLoad | Bool | `false` | If true the print provider will load the capabilities document upon instantiation. Cannot be used with the "capabilities" option.
| autoOpen | Bool | `true` | If true the printed map will be automatically opened. Applies to POST requests only.
| capabilities | Object | `undefined` | The capabilities of the print service. Only required if `url` is not provided. This is the object returned by the "info.json" endpoint of the print service, and is usually obtained by including a script tag pointing to `http://path/to/mapfish/print/info.json?var=myvar` in the head of the html  document.
| outputFormat | String | `'pdf'` | The document format for the printed map.
| outputFilename | String | `'leaflet-map'` | The filename for the printed map.
| layout | String | `undefined` | Name of a layout supported by the print service to use as the default layout when print() is called without a layout specified. If not provided will use the name of the first layout defined in the service capabilites.
| dpi | Number | `undefined` | The resolution to use for the printed map, defaults to the first dpi value supported by the print service.
| rotation | Number | `0` | The rotation of the page.
| customParams | Object | `{}`| Key value pairs of additional parameters that will be sent to the print service.
| listeners | Object | `undefined` | A set of type/listener pairs, the function context can be passed using the "context" property of the event map e.g. `{beforeprint: onBeforePrint, print: onPrint, context: window}.
| legends | Bool | `false` | Should WMS legends be generated for all WMS layers? Note that layers with multiple symbols (eg. classified layers) may not work well with MapFish's legend by default. 

Print Control Options:

| Option | Type | Default | Description
| --- | --- | --- | ---
| position | String | `'topleft'` | The initial position of the control (one of the map corners). See [control positions](http://leafletjs.com/reference.html#control-positions).
| showLayouts | Bool | `true` | If true the layouts supported by the print service will be displayed when the user clicks the print control, otherwise the map will be printed using the layout the print provider was configured with.

###Methods

Print Provider Methods:
````javascript
loadCapabilities()
````
Loads the capabilities for the print service. The `url` config option must have been specified and the `autoLoad` config option set to `false`.
````javascript
print(options)
````
Prints the current map view using the specified options. Valid options are: `proxy, method, outputFormat, outputFilename, layout, dpi, rotation, customParams`
````javascript````
getCapabilities()
````
Gets the capabilities object the provider has been configured with.
````javascript
setMap()
````
Sets a `Leaflet.Map` object on the provider. When using with print control this will be done for you.
````javascript
setDpi()
````
Sets the resolution for the printed map. Must be a valid dpi supported by the print service.
````javascript
setLayout()
````
Sets the name of the layout to use for the printed map.
````javascript
setRotation()
````
Sets the rotation of the printed map.

###Events

The following events are emitted by the print provider and can be listened for using the standard [Leaflet events methods](http://leafletjs.com/reference.html#events) or by passing an event map as the `listeners` config option.

####capabilitiesload

Fired when the print service capabilities have been loaded by a call to `loadCapabilities()`.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| capabilities | Object | The service capabilities.

####beforeprint

Fired before the printed map is requested.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| map | [L.Map](http://leafletjs.com/reference.html#map-class) | The map to be printed.

####print

Fired immediately after the printed map has been requested if using HTTP GET or upon success if using HTTP POST.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| response | Object | The reponse object returned by the print service. The url for the generated map is accessed though the `getURL` property.

####printexception

Fired when the print request fails.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| response | [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR) | The jqXHR object.

####dpichange

Fired when the provider's `dpi` value is changed via `setDpi()`.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| dpi | Number | The new dpi value.

####layoutchange

Fired when the provider's `layout` value is changed via `setLayout()`.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| layout | String | The new layout value.

####rotationchange

Fired when the provider's `rotation` value is changed via `setRotation()`.

| Property | Type | Description
| --- | --- | ---
| provider | L.print.Provider | The print provider.
| rotation | Number | The new rotation value.

##Limitations

* dashArray style cannot be easily mapped onto OpenLayers `strokeDashstyle` constants so is not supported.
* `Marker` shadow is not drawn.
* Rectangle layer does not provide a `toGeoJSON()` method so is not supported.

##License
This software is released under the [MIT licence](http://www.opensource.org/licenses/mit-license.php).
