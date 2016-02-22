
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
	    // navigationHelpButton:true,
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
	    position: Cesium.Cartesian3.fromDegrees( 112.654457,-7.941044,300000.0),
	    box : {
	        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000),
	        material : Cesium.Color.RED.withAlpha(0)
	    }
	});
	
	// var camera = scene.camera;
 //    camera.flyTo({
 //        destination : Cesium.Cartesian3.fromDegrees(112.654457,-7.941044,300000.0),
 //        orientation : {
 //                        heading : Cesium.Math.toRadians(200.0),
 //                        pitch : Cesium.Math.toRadians(-50.0)
 //                    },
 //        easingFunction : Cesium.EasingFunction.LINEAR_NONE,
 //        complete : function() {
 //            // setTimeout(function() {
 //            //     camera.flyTo({
 //            //         destination : Cesium.Cartesian3.fromDegrees(-73.98585975679403, 40.75759944127251, 186.50838555841779),
 //            //         orientation : {
 //            //             heading : Cesium.Math.toRadians(200.0),
 //            //             pitch : Cesium.Math.toRadians(-50.0)
 //            //         },
 //            //         easingFunction : Cesium.EasingFunction.LINEAR_NONE
 //            //     });
 //            // }, 3000);
 //        }
 //    });
	cesiumWidget.flyTo(center, {
        offset : new Cesium.HeadingPitchRange(0, (-Math.PI / 2)+0.0000001, 45000),
        complete: function(){
		    var camera = cesiumWidget.camera;
		    camera.setView({
		        position : Cesium.Cartesian3.fromDegrees(112.654457,-7.941044,300000.0),
		        orientation: {
		            heading : -Cesium.Math.PI_OVER_TWO,
		            pitch : -Cesium.Math.PI_OVER_FOUR,
		            roll : 0.0
		        }
		    });
        }
    });
        
    var handler = new Cesium.ScreenSpaceEventHandler(cesiumWidget.scene.canvas);
	handler.setInputAction(function(click) {
		var cartesian = cesiumWidget.scene.pickPosition(click.position);
            
        if (Cesium.defined(cartesian)) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
            var heightString = cartographic.height.toFixed(2);
			console.log(longitudeString+":"+latitudeString);
        }

	    var pickedObject = cesiumWidget.scene.pick(click.position);
	    
	    if (Cesium.defined(pickedObject) && (pickedObject.id)) {
        	var entityId = pickedObject.id._id;
			console.log(entityId);
			getPCData(2,entityId);
         //    var cartographic = Cesium.Cartographic.fromCartesian(pickedObject);
         //    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
         //    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
         //    var heightString = cartographic.height.toFixed(2);
	        
	        // console.log(longitudeString+"|"+latitudeString);
	     //    cesiumWidget.camera.flyTo({
		    //     destination : Cesium.Cartesian3.fromDegreesArray(pickedObject.id.polyline.positions.getValue(cesiumWidget.clock.currentTime)),
		    //     orientation : {
		    //         heading : Cesium.Math.toRadians(20.0),
		    //         pitch : Cesium.Math.toRadians(-35.0),
		    //         roll : 0.0
		    //     }
		    // });
	    }
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
    cesiumWidget.dataSources.add(_uh);
    