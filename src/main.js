// main.js - Script principal de Google Earth Engine
// Este archivo coordina todas las funciones definidas en los módulos.

// Importar módulos (asegúrate de que estos módulos estén también en tu entorno GEE
// o que los hayas copiado y pegado como si fueran parte de este archivo,
// ya que GEE no soporta 'import' nativo como Node.js.
// Para GEE, la forma más común es concatenar los archivos o usar funciones en el mismo ámbito.
// Para VSC/Github, esta estructura ayuda a la modularidad.

// --- Definición del Área de Estudio (AOI)
// Si 'geometry' no está definida globalmente en GEE, descomenta la siguiente línea
// y define tu AOI aquí o impórtala desde 'assets/aoi_glaciar.js'
// var aoi = ee.Geometry.Point([-73.045, -50.463]).buffer(20000); // Ejemplo: Glaciar Perito Moreno
var aoi = geometry; // Asume que 'geometry' ya está definida en el editor de GEE


// --- 1. Cargar datos y pre-procesamiento
var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2023-12-01', '2024-05-24') // Rango de fechas ajustado
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15)) // Umbral de nubosidad ajustado
  .sort('system:time_start'); // Ordenar por fecha

print('Número de imágenes encontradas:', collection.size());


// --- 2. Funciones de Procesamiento de Datos (definiciones de data_processing.js)
// Estas funciones se definen aquí directamente para GEE, pero idealmente estarían en un módulo.
// Para GEE, simplemente las incluimos en el mismo archivo.
var addIndices = function(image) {
  var ndsi = image.normalizedDifference(['B3', 'B11']).rename('NDSI');
  var redSnow = image.select('B4').divide(image.select('B8')).rename('RedSnow');
  return image.addBands([ndsi, redSnow]);
};

var classifyAndSmooth = function(image) {
  var classified = image.expression(
    '(NDSI > 0.4) && (RedSnow > 0.5) ? 3' +
    ': (NDSI > 0.3) && (RedSnow > 0.3) ? 2' +
    ': 1',
    {
      'NDSI': image.select('NDSI'),
      'RedSnow': image.select('RedSnow')
    }
  ).rename('AlgalZone').int();
  var smoothed = classified.focal_mode(1, 'square', 'pixels');
  return smoothed.copyProperties(image, ['system:time_start']);
};


// --- 3. Aplicar procesamiento
var collectionWithIndices = collection.map(addIndices);
var classifiedCollection = collectionWithIndices.map(classifyAndSmooth);


// --- 4. Funciones de Análisis de Datos (definiciones de data_analysis.js)
var calculatePercentages = function(image) {
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
    'total_pixels': totalPixels,
    'system:time_start': image.get('system:time_start')
  });
};

// --- 5. Crear FeatureCollection con porcentajes
var percentagesFc = classifiedCollection.map(calculatePercentages);
print('FeatureCollection de porcentajes (primeros 5):', percentagesFc.limit(5));


// --- 6. Parámetros de Visualización (definiciones de visualization.js)
var visParamsAlgal = { min: 1, max: 3, palette: ['green', 'orange', 'red'] };
var visParamsRGB = { bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4 };


// --- 7. Elementos de UI (definiciones de ui_elements.js)
var mainPanel = ui.Panel({ style: { width: '400px', padding: '8px' } });
ui.root.insert(0, mainPanel);

var title = ui.Label('Monitoreo de Zonas de Algas (Chlamydomonas nivalis)', {
  fontWeight: 'bold',
  fontSize: '18px',
  margin: '10px 0 10px 0'
});
mainPanel.add(title);

var percentagePanel = ui.Panel({ style: {margin: '10px 0'} });
mainPanel.add(percentagePanel);

var sliderLabel = ui.Label('Selecciona una fecha:', { margin: '10px 0 5px 0', fontWeight: 'bold' });
mainPanel.add(sliderLabel);

// Variables globales para UI
var slider;
var dateList = [];


// --- 8. Funciones de UI y Lógica del Slider
var updateMapAndPanel = function(dateIndex) {
  Map.layers().reset();

  var imageList = classifiedCollection.toList(classifiedCollection.size());
  var currentImage = ee.Image(imageList.get(dateIndex));
  var clippedImage = currentImage.clip(aoi);

  var imageDate = ee.Date(currentImage.get('system:time_start'));
  var originalImage = collection
    .filterDate(imageDate, imageDate.advance(1, 'day'))
    .first();

  if (originalImage) {
    Map.addLayer(originalImage.clip(aoi), visParamsRGB, 'Color Natural (RGB)', true, 0.8);
  }

  Map.addLayer(clippedImage.select('AlgalZone'), visParamsAlgal, 'Zonas de Chlamydomonas nivalis');
  Map.centerObject(aoi, 12);

  var percentageFeature = calculatePercentages(currentImage);
  percentageFeature.evaluate(function(feature, error) {
    if (error) { print('Error calculando porcentajes:', error); return; }

    percentagePanel.clear();
    if (feature && feature.properties) {
      var props = feature.properties;
      percentagePanel.add(ui.Label('Fecha: ' + (props.date || 'No disponible'), { fontWeight: 'bold', fontSize: '14px' }));
      percentagePanel.add(ui.Label('Total píxeles: ' + (props.total_pixels || 0), { fontSize: '12px', color: 'gray' }));
      percentagePanel.add(ui.Label('Baja Probabilidad: ' + (props.percentage_low || 0) + '%', { color: 'green', fontWeight: 'bold' }));
      percentagePanel.add(ui.Label('Media Probabilidad: ' + (props.percentage_medium || 0) + '%', { color: 'orange', fontWeight: 'bold' }));
      percentagePanel.add(ui.Label('Alta Probabilidad: ' + (props.percentage_high || 0) + '%', { color: 'red', fontWeight: 'bold' }));
    } else {
      percentagePanel.add(ui.Label('Error: No se pudieron calcular los porcentajes', { color: 'red' }));
    }
  });
};


// --- 9. Inicialización de UI: Slider y Gráfico
classifiedCollection.size().evaluate(function(size, error) {
  if (error) { print('Error obteniendo el tamaño de la colección clasificada:', error); return; }

  if (size === 0) {
    var errorLabel = ui.Label('No se encontraron imágenes en el rango de fechas especificado. Ajuste los filtros.', {
      color: 'red', fontWeight: 'bold', margin: '10px'
    });
    mainPanel.add(errorLabel);
    print('No hay imágenes en la colección para el AOI y filtros especificados.');
    return;
  }

  // Si hay imágenes, procedemos a obtener las fechas y configurar el slider/gráfico
  var datesTimestamp = classifiedCollection.aggregate_array('system:time_start');
  datesTimestamp.evaluate(function(timestampList, error) {
    if (error) { print('Error obteniendo timestamps de fechas:', error); return; }

    dateList = timestampList.map(function(timestamp) {
      return ee.Date(timestamp).format('YYYY-MM-dd').getInfo();
    });

    // Crear etiquetas de fecha para el slider
    var dateLabels = ui.Panel({ layout: ui.Panel.Layout.flow('horizontal'), style: {margin: '0 0 10px 0'} });
    dateLabels.add(ui.Label(dateList[0] || 'Primera', {fontSize: '10px'}));
    dateLabels.add(ui.Label('→', {textAlign: 'center', stretch: 'horizontal', fontSize: '10px'}));
    dateLabels.add(ui.Label(dateList[dateList.length - 1] || 'Última', {fontSize: '10px'}));
    mainPanel.add(dateLabels);

    slider = ui.Slider({
      min: 0,
      max: Math.max(0, dateList.length - 1),
      step: 1,
      value: 0,
      onChange: updateMapAndPanel,
      style: { stretch: 'horizontal', margin: '0 0 10px 0' }
    });
    mainPanel.add(slider);

    updateMapAndPanel(0); // Inicializar con la primera imagen
  });

  // 7. Graficar evolución temporal (esto se evalúa solo una vez)
  percentagesFc.evaluate(function(featuresData, error) {
    if (error) { print('Error obteniendo datos para el gráfico:', error); return; }
    if (featuresData && featuresData.features && featuresData.features.length > 0) {
      var chart = ui.Chart.feature.byFeature({
        features: ee.FeatureCollection(featuresData),
        xProperty: 'date',
        yProperties: ['percentage_low', 'percentage_medium', 'percentage_high']
      }).setOptions({
        title: 'Evolución Temporal de Zonas de Algas (Chlamydomonas nivalis)',
        vAxis: { title: 'Porcentaje (%)', minValue: 0 },
        hAxis: { title: 'Fecha', format: 'MMM-yy' },
        series: {
          0: { color: 'green', label: 'Baja Probabilidad', lineWidth: 2, pointSize: 4 },
          1: { color: 'orange', label: 'Media Probabilidad', lineWidth: 2, pointSize: 4 },
          2: { color: 'red', label: 'Alta Probabilidad', lineWidth: 2, pointSize: 4 }
        }
      });
      print(chart);
    } else {
      print('No hay datos de porcentaje para graficar. Esto podría indicar que los cálculos de porcentaje resultaron en Features vacíos.');
    }
  });
});


// --- 10. Botón de exportación
var exportButton = ui.Button({
  label: 'Exportar imagen GeoTIFF actual',
  onClick: function() {
    if (slider && dateList.length > 0) {
      var currentIndex = slider.getValue() || 0;
      var imageList = classifiedCollection.toList(classifiedCollection.size());
      var currentImageForExport = ee.Image(imageList.get(currentIndex)).clip(aoi);
      
      var dateString = dateList[currentIndex] ? dateList[currentIndex].replace(/-/g, '') : 'unknown';
      var description = 'Chlamydomonas_' + dateString;
      
      Export.image.toDrive({
        image: currentImageForExport.select('AlgalZone'),
        description: description,
        scale: 10,
        region: aoi,
        maxPixels: 1e13,
        fileFormat: 'GeoTIFF'
      });
      print('Exportando imagen clasificada:', description);
    } else {
      print('Error: No hay imágenes disponibles para exportar');
    }
  },
  style: { margin: '10px 0 0 0' }
});
mainPanel.add(exportButton);


// --- 11. Leyenda (definiciones de visualization.js o ui_elements.js)
var legend = ui.Panel({ style: { position: 'bottom-left', padding: '8px' } });
var legendTitle = ui.Label('Leyenda', { fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' });

var makeRow = function(color, name) {
  var colorBox = ui.Label({ style: { backgroundColor: color, padding: '8px', margin: '0 4px 0 0' } });
  var description = ui.Label(name, { margin: '0 0 4px 0' });
  return ui.Panel({ widgets: [colorBox, description], layout: ui.Panel.Layout.Flow('horizontal') });
};

legend.add(legendTitle);
legend.add(makeRow('green', 'Baja Probabilidad'));
legend.add(makeRow('orange', 'Media Probabilidad'));
legend.add(makeRow('red', 'Alta Probabilidad'));
Map.add(legend);

