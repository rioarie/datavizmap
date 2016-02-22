
    "use strict";
    
    function processDataJson(){
        this._name = name;
        this._changed = new Cesium.Event();
        this._error = new Cesium.Event();
        this._isLoading = false;
        this._loading = new Cesium.Event();
        this._entityCollection = new Cesium.EntityCollection();
        this._seriesNames = [];
        this._seriesToDisplay = undefined;
        this._heightScale = 100;
    };


    Object.defineProperties(processDataJson.prototype, {
        name : {
            get : function() {
                return this._name;
            }
        },
        clock : {
            value : undefined,
            writable : false
        },
        entities : {
            get : function() {
                return this._entityCollection;
            }
        },
        isLoading : {
            get : function() {
                return this._isLoading;
            }
        },
        changedEvent : {
            get : function() {
                return this._changed;
            }
        },
        errorEvent : {
            get : function() {
                return this._error;
            }
        },
        loadingEvent : {
            get : function() {
                return this._loading;
            }
        },
        seriesNames : {
            get : function() {
                return this._seriesNames;
            }
        },
        seriesToDisplay : {
            get : function() {
                return this._seriesToDisplay;
            },
            set : function(value) {
                this._seriesToDisplay = value;
                
                var collection = this._entityCollection;
                var entities = collection.values;
                collection.suspendEvents();
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    entity.show = value === entity.seriesName;
                }
                collection.resumeEvents();
            }
        },
        heightScale : {
            get : function() {
                return this._heightScale;
            },
            set : function(value) {
                if (value > 0) {
                    throw new Cesium.DeveloperError('value must be greater than 0');
                }
                this._heightScale = value;
            }
        }
    });

    

	processDataJson.prototype.loadUrl = function(url) {
        if (!Cesium.defined(url)) {
            throw new Cesium.DeveloperError("url must be defined.");
        }

        showloadingscreen();

        var that = this;
        return Cesium.when(Cesium.loadJson(url), function(json) {
            return that.load(json);
        }).otherwise(function(error) {
            hideloadingscreen();
            this._setLoading(false);
            that._error.raiseEvent(that, error);
            return Cesium.when.reject(error);
        });
    };
    processDataJson.prototype.load = function(data) {
        if (!Cesium.defined(data)) 
            throw new Cesium.DeveloperError("data must be defined.");

        //Clear out any data that might already exist.
        this._setLoading(true);
        this._seriesNames.length = 0;
        this._seriesToDisplay = undefined;

        var heightScale = this.heightScale;
        var entities = this._entityCollection;

        entities.suspendEvents();
        entities.removeAll();

        var length = data.length;
        
        var seriesName = "semua";
        this._seriesNames.push(seriesName); 
        
        this._seriesToDisplay = seriesName;
        
        console.log("data length "+length+"|"+seriesName);
        for(var i = 0 ; i < length ; i++) {
            try {
                var node = data[i];
                var height = node.kwh_lwbp;
                var lat = node.gps_l;
                var lon = node.gps_b;
                
                if(height <= 0) {
                    continue;
                }

                var surfacePosition = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
                var heightPosition = Cesium.Cartesian3.fromDegrees(lon, lat, height * heightScale);
    
    			
                //WebGL Globe only contains lines, so that's the only graphics we create.
                var polyline = new Cesium.PolylineGraphics();
                polyline.material = new Cesium.ColorMaterialProperty(getBarColor(height,0.9));
                polyline.width = new Cesium.ConstantProperty(3);
                polyline.followSurface = new Cesium.ConstantProperty(false);
                polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);
    
                var entity = new Cesium.Entity({
                    id : node.id,
                    show : true,
                    polyline : polyline,
                    seriesName : seriesName 
                });
    
                entities.add(entity);
                console.log("add entity-"+i);
            }catch(err){console.log(err);}
        }

        entities.resumeEvents();
        this._changed.raiseEvent(this);
        this._setLoading(false);
        hideloadingscreen();
    }
    
    var getBarColor = function(kwh,alpha){
        if(kwh < 70)
            return Cesium.Color.GREEN.withAlpha(alpha); 
        else if(kwh >=70 && kwh<150)
            return Cesium.Color.ORANGE.withAlpha(alpha);
        else if(kwh >=150 )
            return Cesium.Color.RED.withAlpha(alpha);
    }


    processDataJson.prototype._setLoading = function(isLoading) {
        if (this._isLoading !== isLoading) {
            this._isLoading = isLoading;
            this._loading.raiseEvent(this, isLoading);
        }
    };


    function showloadingscreen(){
        $('#loadingOverlay').show();
    }
    function hideloadingscreen(){
        $('#loadingOverlay').hide();
    }

    var _uh = new processDataJson();

    //http://159.8.109.244:4040/power-api/all/thn/bln
    //http://159.8.109.244:4040/power-api/detail/thn/bln/id
    function getPCData(tipe,entityId){
        var selectedtime  = $('#selectedtime option:selected').val().split("|");

        var url = "";
        switch(tipe){
            case 1 : //alldata
                url = "http://159.8.109.244:4040/power-api/all/"+selectedtime[0]+"/"+selectedtime[1];
                break;
            case 2: //detaildata
                url = "http://159.8.109.244:4040/power-api/detail/"+selectedtime[0]+"/"+selectedtime[1]+"/"+entityId;
                break;
        }

        // _uh = new processDataJson();
        console.log(url);
        _uh.loadUrl(url);
        loadd3(url);
    }






    