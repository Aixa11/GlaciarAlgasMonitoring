// export_utils.js
// Contiene la función para exportar la imagen clasificada.

/**
 * Exporta una imagen clasificada a Google Drive.
 * @param {ee.Image} imageToExport La imagen a exportar (debe ser la imagen clasificada).
 * @param {ee.Geometry} region La región de exportación.
 * @param {string} dateString La fecha formateada de la imagen para el nombre del archivo.
 */
exports.exportClassifiedImage = function(imageToExport, region, dateString) {
  var description = 'Chlamydomonas_' + dateString;
  Export.image.toDrive({
    image: imageToExport.select('AlgalZone'), // Exportar solo la banda clasificada
    description: description,
    scale: 10, // Resolución en metros por píxel
    region: region,
    maxPixels: 1e13, // Límite máximo de píxeles
    fileFormat: 'GeoTIFF'
  });
  print('Exportando imagen clasificada:', description);
};