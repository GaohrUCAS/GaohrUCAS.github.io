var size = 0;

var styleCache_province_cn={}
var style_province_cn = function(feature, resolution){
    var value = ""
    var size = 0;
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(253,191,111,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0}), fill: new ol.style.Fill({color: 'rgba(0,0,0,0.7)'})
    })];
    if (feature.get("NAME") !== null) {
        var labelText = String(feature.get("NAME"));
    } else {
        var labelText = ""
    }
    var key = value + "_" + labelText

    if (!styleCache_province_cn[key]){
        var text = new ol.style.Text({
              font: '11.7px \'微软雅黑\', sans-serif',
              text: labelText,
              textBaseline: "center",
              textAlign: "left",
              offsetX: 5,
              offsetY: 3,
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 255)'
              }),
            });
        styleCache_province_cn[key] = new ol.style.Style({"text": text})
    }
    var allStyles = [styleCache_province_cn[key]];
    allStyles.push.apply(allStyles, style);
    return allStyles;
};