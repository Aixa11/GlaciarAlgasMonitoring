// data_processing.js 
// Contiene funciones para el pre-procesamiento y clasificación de imágenes Sentinel-2.

/**
 * Calcula los índices NDSI (Normalized Difference Snow Index) y Red Snow Index.
 * @param {ee.Image} image Una imagen Sentinel-2 con bandas B3, B4, B8, B11.
 * @returns {ee.Image} La imagen original con las nuevas bandas de índice.
 */
exports.addIndices = function(image) {
  var ndsi = image.normalizedDifference(['B3', 'B11']).rename('NDSI');
  var redSnow = image.select('B4').divide(image.select('B8')).rename('RedSnow');
  return image.addBands([ndsi, redSnow]);
};

/**
 * Clasifica una imagen en zonas de algas (Baja, Media, Alta probabilidad)
 * y aplica un suavizado (focal_mode) para reducir el ruido.
 * @param {ee.Image} image Una imagen con bandas 'NDSI' y 'RedSnow'.
 * @returns {ee.Image} La imagen clasificada y suavizada ('AlgalZone').
 */
exports.classifyAndSmooth = function(image) {
  var classified = image.expression(
    '(NDSI > 0.4) && (RedSnow > 0.5) ? 3' + // Zona de alta probabilidad (rojo)
    ': (NDSI > 0.3) && (RedSnow > 0.3) ? 2' + // Zona media (amarillo)
    ': 1', // Zona baja (verde)
    {
      'NDSI': image.select('NDSI'),
      'RedSnow': image.select('RedSnow')
    }
  ).rename('AlgalZone').int(); // Asegurarse de que sea un tipo entero

  // Suavizar la imagen clasificada para reducir ruido
  var smoothed = classified.focal_mode(1, 'square', 'pixels');

  // Mantener las propiedades de tiempo de la imagen original
  return smoothed.copyProperties(image, ['system:time_start']);
}
