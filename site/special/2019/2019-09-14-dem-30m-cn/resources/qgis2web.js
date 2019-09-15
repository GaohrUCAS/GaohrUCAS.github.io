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
        expandedAttribution,new ol.control.LayerSwitcher({tipLabel: "Layers"})
    ]),
    target: document.getElementById('map'),
    renderer: 'canvas',
    overlays: [overlayPopup],
    layers: layersList,
    view: new ol.View({
         maxZoom: 28, minZoom: 4
    })
});

map.getView().fit([6020697.062490, 1820319.243836, 18261099.299664, 7048967.501323], map.getSize());

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
            popupText = '<table>';
            for (var i=0; i<currentFeatureKeys.length; i++) {
				if (currentFeatureKeys[i] != 'geometry') {
                    popupField = '';
					if(layer.get('fieldAliases')[currentFeatureKeys[i]] == "NAME") {
						popupField += currentFeature.get(currentFeatureKeys[i]);
					}
                    popupText = popupText + '<tr>' + popupField + '</tr>';
                }
            }
            popupText = popupText + '</table>';
        }
    });

    if (doHighlight) {
        if (currentFeature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (currentFeature) {
                var styleDefinition = currentLayer.getStyle().toString();
                highlightStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,255,255,0.5)'
                    })
                })
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

var select_data_id = new Array();
var onSingleClick = function(evt) {
    // if (doHover) {
    //     return;
    // }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
	var p_name = ""
	var p_id = ""
    var popupText = '';
    var currentFeature;
    var currentFeatureKeys;
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        currentFeature = feature;
        currentFeatureKeys = currentFeature.getKeys();
        popupText = '';
        for (var i=0; i<currentFeatureKeys.length; i++) {
            if (currentFeatureKeys[i] != 'geometry') {
				if(currentFeatureKeys[i] == "NAME") {
					p_name = currentFeature.get(currentFeatureKeys[i]);
				} else if(currentFeatureKeys[i] == "ID") {
					p_id = String(parseInt(currentFeature.get(currentFeatureKeys[i])));
				}
            }
        }
    });
	if(select_data_id.indexOf(p_id) == -1) {
		if(p_name != "") {
			// 添加id
			select_data_id.push(p_id);
			$("#data-list").append("<img id=\"loading\" src=\"2019-09-14-dem-30m-cn/loading.gif\" width=\"50%\">");
			setTimeout(function() {
				// 稍微增加等待时间
				$("#loading").remove();
				$("#data-list").append("<div id=\"" + p_id + "\" class=\"data-selected\">" +
								"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" onclick=\"removeData('" + p_id + "')\">&times;</button>" +
								p_name + "-DEM-30m | TIFF" +
								"</div>");
			}, 2000);
		}
	} else {
		alert(p_name + "在数据列表中已存在！");
	}
	
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

/**********************************************************************/

function removeData(id) {
	$("#" + id).remove();
	// 移除id
	select_data_id.splice(select_data_id.indexOf(id), 1);
}

$("#submit").click(function() {
	$(".cont").html("");
	// 读取数组，获取相应数据链接
	$('.cont').append("<img id=\"loading\" src=\"2019-09-14-dem-30m-cn/loading.gif\" width=\"30%\">")
	setTimeout(function() {
				$("#loading").remove();
				for(var k = 0; k < select_data_id.length; k++) {
					$(".cont").append("<p><span>" + data_links[select_data_id[k]][0] + "</span> <a href=\"" + data_links[select_data_id[k]][1] + "\">" + data_links[select_data_id[k]][1] + "</a></p>");
				}
				
			}, 1000);
	
	
	$('.close').click(function () {
		$('#popup_link').hide();
		$('#mask_shadow').hide();
	})
});

$("#refresh").click(function() {
	$("#data-list").html("");
	// 清空数组
	select_data_id = [];
});

var data_links = {
	"0":["浙江", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"1":["云南", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"2":["新疆", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"3":["香港", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"4":["西藏", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"5":["台湾", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"6":["四川", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"7":["陕西", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"8":["山西", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"9":["山东", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"10":["青海", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"11":["宁夏", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"12":["内蒙古", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"13":["辽宁", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"14":["江西", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"15":["吉林", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"16":["湖南", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"17":["湖北", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"18":["黑龙江", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"19":["湖南", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"20":["北京市", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"21":["天津市", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"22":["海南", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"23":["贵州", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"24":["广西", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"25":["甘肃", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"26":["福建", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"27":["澳门", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"28":["安徽", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"29":["上海", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"30":["重庆", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"31":["江苏", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"32":["广东", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"],
	"33":["河北", "抱歉，暂无该省区DEM数据，请在评论区留言定制数据！"]
}













