

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};
var overlayPopup = new ol.Overlay({
    element: container
});

var expandedAttribution = new ol.control.Attribution({
    collapsible: false
});

var map = new ol.Map({
    controls: ol.control.defaults({attribution:false}).extend([
        expandedAttribution
    ]),
    target: document.getElementById('map'),
    renderer: 'canvas',
    overlays: [overlayPopup],
    layers: layersList,
    view: new ol.View({
         maxZoom: 28, minZoom: 4
    })
});

map.getView().fit([9020697.062490, 1820319.243836, 17261099.299664, 7048967.501323], map.getSize());
map.getView().setZoom(6);

var layerSwitcher = new ol.control.LayerSwitcher({tipLabel: "Layers"});
map.addControl(layerSwitcher);
layerSwitcher.hidePanel = function() {};
layerSwitcher.showPanel();

var NO_POPUP = 0
var ALL_FIELDS = 1

/**
 * Returns either NO_POPUP, ALL_FIELDS or the name of a single field to use for
 * a given layer
 * @param layerList {Array} List of ol.Layer instances
 * @param layer {ol.Layer} Layer to find field info about
 */
function getPopupFields(layerList, layer) {
    // Determine the index that the layer will have in the popupLayers Array,
    // if the layersList contains more items than popupLayers then we need to
    // adjust the index to take into account the base maps group
    var idx = layersList.indexOf(layer) - (layersList.length - popupLayers.length);
    return popupLayers[idx];
}


var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: collection,
        useSpatialIndex: false // optional, might improve performance
    }),
    style: [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.1)'
        }),
    })],
    updateWhileAnimating: true, // optional, for instant visual feedback
    updateWhileInteracting: true // optional, for instant visual feedback
});

var doHighlight = true;
var doHover = true;

var highlight;
var onPointerMove = function(evt) {
    if (!doHover && !doHighlight) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var popupField;
    var popupText = '';
    var currentFeature;
    var currentLayer;
    var currentFeatureKeys;
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        // We only care about features from layers in the layersList, ignore
        // any other layers which the map might contain such as the vector
        // layer used by the measure tool
        if (layersList.indexOf(layer) === -1) {
            return;
        }
        currentFeature = feature;
        currentLayer = layer;
        currentFeatureKeys = currentFeature.getKeys();
        var doPopup = false;
        for (k in layer.get('fieldImages')) {
            if (layer.get('fieldImages')[k] != "Hidden") {
                doPopup = true;
            }
        }
        if (doPopup) {
            popupText = '';
            for (var i=0; i<currentFeatureKeys.length; i++) {
                if (currentFeatureKeys[i] != 'geometry') {
                    popupField = '';
					if(layer.get('fieldAliases')[currentFeatureKeys[i]] == "名称") {
						popupField += currentFeature.get(currentFeatureKeys[i]);
					}
                    popupText += '<tr>' + popupField + '</tr>';
                }
            }
        }
    });

    
    if (doHighlight) {
        if (currentFeature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (currentFeature) {
                var styleDefinition = currentLayer.getStyle().toString();

                if (currentFeature.getGeometry().getType() == 'Point') {
                    // var radius = styleDefinition.split('radius')[1].split(' ')[1];
					
                    highlightStyle = new ol.style.Style({
                        image: new ol.style.Circle({
							stroke: new ol.style.Stroke({color: 'rgba(255,0,0,0.8)'}),
                            fill: new ol.style.Fill({
                                color: "#ffff00"
                            }),
                            radius: p_size
                        })
                    })
                } else if (currentFeature.getGeometry().getType() == 'LineString') {

                    var featureWidth = styleDefinition.split('width')[1].split(' ')[1].replace('})','');

                    highlightStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffff00',
                            lineDash: null,
                            width: featureWidth
                        })
                    });

                } else {
                    highlightStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: '#ffff00'
                        })
                    })
                }
                featureOverlay.getSource().addFeature(currentFeature);
                featureOverlay.setStyle(highlightStyle);
            }
            highlight = currentFeature;
        }
    }

    if (doHover) {
        if (popupText) {
            overlayPopup.setPosition(coord);
            content.innerHTML = popupText;
            container.style.display = 'block';        
        } else {
            container.style.display = 'none';
            closer.blur();
        }
    }
};

var onSingleClick = function(evt) {
    //if (doHover) {
    //    return;
    //}
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var popupField;
    var popupText = "";
    var currentFeature;
    var currentFeatureKeys;
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        currentFeature = feature;
        currentFeatureKeys = currentFeature.getKeys();
		name = "";
		major = "";
		prop = "";
		type = "";
		is985 = "";
		is211 = "";
		is11 = "";
		upins = "";
		addr = "";
		lng = "";
		lat = "";
		for (var i=0; i<currentFeatureKeys.length; i++) {
            if (currentFeatureKeys[i] != 'geometry') {
                popupField = '';
				field = currentFeatureKeys[i];
				if(field == "名称") {
					name = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "专业类别") {
					major = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "办学性质") {
					prop = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "学校类型") {
					type = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "985高校") {
					is985 = currentFeature.get(currentFeatureKeys[i]);
					if(is985 == 1) {
						is985 = "<span class='g-color-green'>是</span>";
					} else {
						is985 = "<span class='g-color-red'>否</span>";
					}
				} else if(field == "211院校") {
					is211 = currentFeature.get(currentFeatureKeys[i]);
					if(is211 == 1) {
						is211 = "<span class='g-color-green'>是</span>";
					} else {
						is211 = "<span class='g-color-red'>否</span>";
					}
				} else if(field == "双一流") {
					is11 = currentFeature.get(currentFeatureKeys[i]);
					if(is11 == 1) {
						is11 = "<span class='g-color-green'>是</span>";
					} else {
						is11 = "<span class='g-color-red'>否</span>";
					}
				} else if(field == "隶属") {
					upins = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "地址") {
					addr = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "经度") {
					lng = currentFeature.get(currentFeatureKeys[i]);
				} else if(field == "纬度") {
					lat = currentFeature.get(currentFeatureKeys[i]);
				}
            }
        }
		popupText += "<span><b>" + name + "</b></span><br>" +
					"<span>类别：" + major + "</span><br>" +
					"<span>性质：" + prop + "</span><br>" +
					"<span>类型：" + type + "</span><br>" +
					"<span>985：" + is985 + "</span><br>" +
					"<span>211：" + is211 + "</span><br>" +
					"<span>双一流：" + is11 + "</span><br>" +
					"<span>隶属：" + upins + "</span><br>" +
					"<span>地址：" + addr + "</span><br>" +
					"<span>坐标：" + lng + ", " + lat + "</span>";
							
		$("#info").html(popupText);
		popupText = "";
    });
};



map.on('pointermove', function(evt) {
    onPointerMove(evt);
});
map.on('singleclick', function(evt) {
    onSingleClick(evt);
});





var attribution = document.getElementsByClassName('ol-attribution')[0];
var attributionList = attribution.getElementsByTagName('ul')[0];
var firstLayerAttribution = attributionList.getElementsByTagName('li')[0];
var qgis2webAttribution = document.createElement('li');
qgis2webAttribution.innerHTML = '<a href="https://github.com/tomchadwin/qgis2web">qgis2web</a>';
attributionList.insertBefore(qgis2webAttribution, firstLayerAttribution);
