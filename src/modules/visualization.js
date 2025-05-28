// visualization.js
// Contiene parámetros de visualización y funciones relacionadas con la leyenda.

/**
 * Parámetros de visualización para las zonas de algas clasificadas.
 */
exports.visParamsAlgal = {
  min: 1,
  max: 3,
  palette: ['green', 'orange', 'red'] // Baja, Media, Alta
};

/**
 * Parámetros de visualización para las imágenes Sentinel-2 en color natural (RGB).
 */
exports.visParamsRGB = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.4 // Ajuste de gamma para mejor contraste
};

/**
 * Crea un panel UI para una fila de leyenda con una caja de color y una descripción.
 * @param {string} color El código de color para la caja.
 * @param {string} name La descripción del elemento de la leyenda.
 * @returns {ui.Panel} Un panel que representa una fila de la leyenda.
 */
exports.makeLegendRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 4px 0 0'
    }
  });

  var description = ui.Label(name, {
    margin: '0 0 4px 0'
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

/**
 * Crea y añade un panel de leyenda al mapa de GEE.
 */
exports.addLegendToMap = function() {
  var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px'
    }
  });

  var legendTitle = ui.Label('Leyenda', {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 4px 0'
  });

  legend.add(legendTitle);
  legend.add(exports.makeLegendRow('green', 'Baja Probabilidad'));
  legend.add(exports.makeLegendRow('orange', 'Media Probabilidad'));
  legend.add(exports.makeLegendRow('red', 'Alta Probabilidad'));

  Map.add(legend);
};