(function(){
    "use strict";
    
    
    var processDataJson = function(){

	};

	processDataJson.prototype.loadUrl = function(url) {
        if (!Cesium.defined(url)) {
            throw new Cesium.DeveloperError("url must be defined.");
        }

        var that = this;
        return Cesium.when(Cesium.loadJson(url), function(json) {
            return that.load(json);
        }).otherwise(function(error) {
            this._setLoading(false);
            that._error.raiseEvent(that, error);
            return Cesium.when.reject(error);
        });
    };
    processDataJson.prototype.load = function(data) {
        if (!Cesium.defined(data)) 
            throw new Cesium.DeveloperError("data must be defined.");


        console.log('data length'+data.length);
        var length = data.length;
        for(var i = 0 ; i < length ; i++) {
            console.log('print data'+i);
            var node = data[i];
            
        	cesiumWidget.entities.add({
			    name : 'Red box with black outline',
			    position: Cesium.Cartesian3.fromDegrees(node.lon, node.lat,(node.kwh*1000.0)/2),
			    box : {
			        dimensions : new Cesium.Cartesian3(5000.0, 5000.0, node.kwh*1000.0),
			        material : getBarColor(node.kwh,0.5)
			    }
			}); 
			
            cesiumWidget.entities.add({
                position: Cesium.Cartesian3.fromDegrees(node.lon, node.lat),
                name : 'Red ellipse on surface with outline',
                ellipse : {
                    semiMinorAxis : 10000.0,
                    semiMajorAxis : 10000.0,
                    material : getBarColor(node.kwh,0.4)
                }
            });
            // Perform xml processing
            // if (index + 1 < length && index % 100 == 0) {
            //     index++;
            //     setTimeout(process, 5);
            // }
        }
        
    }
    
    var getBarColor = function(kwh,alpha){
        if(kwh < 70)
            return Cesium.Color.GREEN.withAlpha(alpha) ; 
        else if(kwh >=70 && kwh<150)
            return Cesium.Color.ORANGE.withAlpha(alpha)
        else if(kwh >=150 )
            return Cesium.Color.RED.withAlpha(alpha)
    }
    
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
	    homeButton:fals,
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
        
//     var layers = cesiumWidget.imageryLayers;
// 	var baseLayerPicker = new Cesium.BaseLayerPicker('baseLayerPickerContainer', {
// 	    globe: cesiumWidget.scene.globe,
// 	    imageryProviderViewModels: imageryViewModels
// 	});
	

    setTimeout(function() {
        console.log('load data..');
        var _uh = new processDataJson();
        _uh.loadUrl('sample2.json');
    }, 3000);
    
    
    
    
    
    
})();