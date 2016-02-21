
    "use strict";

    var imageryViewModels = [];

	imageryViewModels.push(new Cesium.ProviderViewModel({
	    name: 'Streets & Terrain',
	    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/mapboxStreets.png'),
	    tooltip: 'The most useful Street and Reference basemap \
		anywhere on the planet, sourced from Mapbox and OpenStreet-Map. \nhttp://mapbox.com',
	    creationFunction: function () {
	        return new Cesium.MapboxImageryProvider({
	        	// style: 'mapbox://styles/mapbox/streets-v8',
	            mapId: 'mapbox.streets',
	//Get your Mapbox API Access Token here: http://mapbox.com
	            accessToken: 'pk.eyJ1IjoicmV6emFpbG1pIiwiYSI6ImNpa3RmeW5jejAwNzV1YW0zN2wxdmVqbDYifQ.LgvTVWOXU0gQsVapFNSZAQ',
	            credit: '© Mapbox © OpenStreetMap Contributors'
	        });
	    }
	}));
	
	Cesium.BingMapsApi.defaultKey = 'At0Yy26LwPp9y9AXNMpwWuhTTWnIkUxm-T5JyKyLq6nE6Uqfdh604aO29scT5VDd';
	
	var cesiumWidget = new Cesium.Viewer('cesiumContainer', {
		baseLayerPicker :true,
	    imageryProvider: true,
	    imageryProviderViewModels: imageryViewModels,
	    timeline: false,
	    animation: false, 
	    navigationHelpButton:false,
	    sceneModePicker:false,
	    homeButton:false,
	    terrainProvider: new Cesium.CesiumTerrainProvider({
	        url: '//assets.agi.com/stk-terrain/world'
	    })
	});
	
    var scene = cesiumWidget.scene;

    cesiumWidget.scene.skyBox.show = false;
    cesiumWidget.scene.sun.show = false;
    cesiumWidget.scene.moon.show = false;

    cesiumWidget.scene.morphToColumbusView(5.0);
    
	var center = cesiumWidget.entities.add({
	    name : 'Red box with black outline',
	    position: Cesium.Cartesian3.fromDegrees( 118.663352,-1.116737,300000.0),
	    box : {
	        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000),
	        material : Cesium.Color.RED.withAlpha(0)
	    }
	});
	
	cesiumWidget.flyTo(center, {
        offset : new Cesium.HeadingPitchRange(Math.PI / 2, -Math.PI / 4, 4500000)
    });
        
	
    cesiumWidget.dataSources.add(_uh);
    