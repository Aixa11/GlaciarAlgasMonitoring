// data_analysis.js 
// Contiene funciones para calcular métricas a partir de imágenes clasificadas.

/**
 * Calcula el porcentaje de cada clase de zona de algas dentro de un área de interés.
 * @param {ee.Image} image La imagen clasificada con la banda 'AlgalZone'.
 * @param {ee.Geometry} aoi El área de interés.
 * @returns {ee.Feature} Un Feature con la fecha y los porcentajes por clase.
 */
exports.calculatePercentages = function(image, aoi) {
  var mask = ee.Image.constant(1).clip(aoi);
  var maskedImage = image.select('AlgalZone').updateMask(mask);

  var histogram = maskedImage.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: aoi,
    scale: 10,
    maxPixels: 1e13
  });

  var histDict = ee.Dictionary(histogram.get('AlgalZone'));

  var class1Count = ee.Number(histDict.get('1', 0));
  var class2Count = ee.Number(histDict.get('2', 0));
  var class3Count = ee.Number(histDict.get('3', 0));

  var totalPixels = class1Count.add(class2Count).add(class3Count);

  var percentage1 = ee.Algorithms.If(totalPixels.gt(0), class1Count.divide(totalPixels).multiply(100).round(), 0);
  var percentage2 = ee.Algorithms.If(totalPixels.gt(0), class2Count.divide(totalPixels).multiply(100).round(), 0);
  var percentage3 = ee.Algorithms.If(totalPixels.gt(0), class3Count.divide(totalPixels).multiply(100).round(), 0);

  var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');

  return ee.Feature(null, {
    'date': date,
    'percentage_low': percentage1,
    'percentage_medium': percentage2,
    'percentage_high': percentage3,
    'total_pixels': totalPixels, // Añadido para debug y más información en el panel
    'system:time_start': image.get('system:time_start') // Para ordenar el gráfico y slider
  });
};