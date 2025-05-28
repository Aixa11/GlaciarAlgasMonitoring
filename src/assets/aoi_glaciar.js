// aoi_glaciar.js
// Define la geometría del Área de Interés (AOI).

// Ejemplo para el Glaciar Perito Moreno. Puedes reemplazarlo con tu propia geometría.
exports.aoi = ee.Geometry.Point([-73.045, -50.463]).buffer(20000);