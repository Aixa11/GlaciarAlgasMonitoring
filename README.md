# Monitoreo de Zonas de Algas en Glaciares (Chlamydomonas nivalis)

Este repositorio contiene un script de Google Earth Engine (GEE) para monitorear la presencia de *Chlamydomonas nivalis* (algas de nieve) en glaciares, utilizando imágenes Sentinel-2.

## Características

- **Carga y filtrado de datos**: Acceso a imágenes Sentinel-2 filtradas por área de estudio, rango de fechas y nubosidad.
- **Cálculo de índices**: Generación de NDSI y un índice de nieve roja para realzar la detección de algas.
- **Clasificación y suavizado**: Clasificación de zonas de algas en baja, media y alta probabilidad, con suavizado para una mejor coherencia espacial.
- **Análisis de porcentajes**: Cálculo automático de la proporción de cada clase de algas dentro del área de estudio.
- **Visualización interactiva**:
    - Panel de control en la interfaz de GEE.
    - Slider para explorar la evolución temporal de las zonas de algas.
    - Gráfico de la evolución de porcentajes a lo largo del tiempo.
    - Leyenda dinámica en el mapa.
- **Exportación**: Opción para exportar la imagen clasificada de la fecha actual como GeoTIFF a Google Drive.

## Área de Estudio (AOI)

Por defecto, el script está configurado para un área de ejemplo en el Glaciar Perito Moreno. Puedes modificar la variable `aoi` en `src/assets/aoi_glaciar.js` o directamente en `src/main.js` si tu AOI es una geometría dibujada en GEE.

## Uso en Google Earth Engine

1.  **Clona este repositorio**:
    `git clone https://github.com/tu_usuario/GlaciarAlgasMonitoring.git`
2.  **Abre los archivos en VSC**.
3.  **Copia el contenido de `src/main.js`** en un nuevo script en tu Code Editor de Google Earth Engine.
4.  **Ejecuta el script**.

## Estructura del Proyecto
```
.
├── GlaciarAlgasMonitoring/
│   ├── .gitignore
│   ├── README.md
│   ├── src/
│   │   ├── main.js                  # Script principal que importa y coordina todo
│   │   ├── modules/
│   │   │   ├── ui_elements.js       # Definiciones de UI (paneles, slider, botones)
│   │   │   ├── data_processing.js   # Funciones de procesamiento (indices, clasificacion, suavizado)
│   │   │   ├── data_analysis.js     # Funciones de análisis (calcular porcentajes)
│   │   │   ├── visualization.js     # Parámetros de visualización y leyenda
│   │   │   └── export_utils.js      # Funciones de exportación
│   │   └── assets/
│   │       └── aoi_glaciar.js       # Definición del Área de Interés (AOI)
│   ├── .vscode/                     # (Opcional) Configuración de VSC específica del proyecto
│   │   ├── settings.json
│   │   └── extensions.json
│   └── docs/                        # Documentación adicional (guías, informes, etc.)
│       ├── setup_guide.md           # Guía de configuración del proyecto
│       └── MonitoreoCHN.pdf         # Informe del análisis de Chlamydomonas nivalis
.
```
## Contribuciones
¡Las contribuciones son bienvenidas! Si deseas mejorar este script, por favor, abre un "issue" o envía un "pull request".

## Licencia
Este proyecto está bajo la Licencia MIT.
