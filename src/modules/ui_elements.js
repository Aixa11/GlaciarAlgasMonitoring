// ui_elements.js
// Define los elementos principales de la interfaz de usuario (paneles, slider, botones)
// y sus funciones de actualización.

// Variables globales para UI (se manejarán en main.js)
// var slider;
// var dateList = [];
// var mainPanel;
// var percentagePanel;

/**
 * Crea y configura el panel principal de la UI.
 * @returns {ui.Panel} El panel principal.
 */
exports.createMainPanel = function() {
  var mainPanel = ui.Panel({
    style: {
      width: '400px',
      padding: '8px'
    }
  });
  ui.root.insert(0, mainPanel);
  return mainPanel;
};

/**
 * Crea y añade el título al panel principal.
 * @param {ui.Panel} parentPanel El panel al que se añadirá el título.
 */
exports.addTitle = function(parentPanel) {
  var title = ui.Label('Monitoreo de Zonas de Algas (Chlamydomonas nivalis)', {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '10px 0 10px 0'
  });
  parentPanel.add(title);
};

/**
 * Crea y añade el panel para mostrar porcentajes.
 * @param {ui.Panel} parentPanel El panel al que se añadirá el panel de porcentajes.
 * @returns {ui.Panel} El panel de porcentajes.
 */
exports.createPercentagePanel = function(parentPanel) {
  var percentagePanel = ui.Panel({
    style: {margin: '10px 0'}
  });
  parentPanel.add(percentagePanel);
  return percentagePanel;
};

/**
 * Actualiza el contenido del panel de porcentajes.
 * @param {ui.Panel} percentagePanel El panel a actualizar.
 * @param {Object} properties Las propiedades del feature con los porcentajes.
 */
exports.updatePercentagePanelContent = function(percentagePanel, properties) {
  percentagePanel.clear();
  if (properties) {
    percentagePanel.add(ui.Label('Fecha: ' + (properties.date || 'No disponible'), { fontWeight: 'bold', fontSize: '14px' }));
    percentagePanel.add(ui.Label('Total píxeles: ' + (properties.total_pixels || 0), { fontSize: '12px', color: 'gray' }));
    percentagePanel.add(ui.Label('Baja Probabilidad: ' + (properties.percentage_low || 0) + '%', { color: 'green', fontWeight: 'bold' }));
    percentagePanel.add(ui.Label('Media Probabilidad: ' + (properties.percentage_medium || 0) + '%', { color: 'orange', fontWeight: 'bold' }));
    percentagePanel.add(ui.Label('Alta Probabilidad: ' + (properties.percentage_high || 0) + '%', { color: 'red', fontWeight: 'bold' }));
  } else {
    percentagePanel.add(ui.Label('Error: No se pudieron calcular los porcentajes', { color: 'red' }));
  }
};

/**
 * Crea y añade el slider para la selección de fechas.
 * @param {ui.Panel} parentPanel El panel al que se añadirá el slider.
 * @param {Array<string>} dateList Array de fechas formateadas.
 * @param {Function} onChangeCallback Función a ejecutar cuando el slider cambie.
 * @returns {ui.Slider} El slider creado.
 */
exports.createDateSlider = function(parentPanel, dateList, onChangeCallback) {
  var sliderLabel = ui.Label('Selecciona una fecha (' + dateList.length + ' imágenes disponibles):', {
    margin: '10px 0 5px 0',
    fontWeight: 'bold'
  });
  parentPanel.add(sliderLabel);

  var dateLabelsPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {margin: '0 0 10px 0'}
  });
  dateLabelsPanel.add(ui.Label(dateList[0] || 'Primera', {fontSize: '10px'}));
  dateLabelsPanel.add(ui.Label('→', {textAlign: 'center', stretch: 'horizontal', fontSize: '10px'}));
  dateLabelsPanel.add(ui.Label(dateList[dateList.length - 1] || 'Última', {fontSize: '10px'}));
  parentPanel.add(dateLabelsPanel);

  var slider = ui.Slider({
    min: 0,
    max: Math.max(0, dateList.length - 1),
    step: 1,
    value: 0,
    onChange: onChangeCallback,
    style: { stretch: 'horizontal', margin: '0 0 10px 0' }
  });
  parentPanel.add(slider);
  return slider;
};