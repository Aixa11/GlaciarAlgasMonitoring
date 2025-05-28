# Guía de Configuración del Proyecto "Monitoreo de Zonas de Algas"

Esta guía te ayudará a configurar tu entorno local y a ejecutar el script de monitoreo de algas de nieve en Google Earth Engine (GEE).

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

* **Cuenta de Google Earth Engine (GEE):** Necesitas una cuenta activa en la plataforma de Google Earth Engine. Si no la tienes, regístrate en [earthengine.google.com](https://earthengine.google.com/).
* **Visual Studio Code (VSC):** Un editor de código como Visual Studio Code es altamente recomendado para gestionar el proyecto localmente. Descárgalo de [code.visualstudio.com](https://code.visualstudio.com/).
* **Git:** Un sistema de control de versiones. Descárgalo de [git-scm.com](https://git-scm.com/).
* **Python (Opcional, para creación automática de estructura):** Si usaste el script de Python para crear la estructura de carpetas, ya lo tienes. Si no, no es estrictamente necesario para la ejecución del GEE script, pero es útil para la gestión de proyectos.

## 2. Configuración del Entorno Local

1.  **Clonar el Repositorio de GitHub:**
    Abre tu terminal (o Git Bash/CMD en Windows) y ejecuta el siguiente comando para clonar este repositorio en tu máquina local:

    ```bash
    git clone [https://github.com/tu_usuario/GlaciarAlgasMonitoring.git](https://github.com/Aixa11/GlaciarAlgasMonitoring.git)
    ```
    (Asegúrate de reemplazar `Aixa11` con tu nombre de usuario de GitHub y `GlaciarAlgasMonitoring` con el nombre de tu repositorio si es diferente).

2.  **Abrir el Proyecto en Visual Studio Code:**
    * Una vez clonado, abre Visual Studio Code.
    * Ve a `File > Open Folder...` y selecciona la carpeta `GlaciarAlgasMonitoring` que acabas de clonar.

3.  **Explorar la Estructura del Proyecto:**
    Familiarízate con la estructura de carpetas:
    * `src/`: Contiene el código fuente principal.
        * `main.js`: El script principal de GEE que copiarás al Code Editor.
        * `modules/`: Contiene funciones modularizadas para el procesamiento de datos, análisis, UI y exportación.
        * `assets/`: Contiene el Área de Interés (AOI) si se define como un script separado.
    * `docs/`: Contiene la documentación del proyecto (como esta guía y el informe de tesis PDF).
    * `README.md`: La descripción general del proyecto.

## 3. Ejecutar el Script en Google Earth Engine

El script de GEE está diseñado para ejecutarse directamente en el Code Editor de la plataforma Google Earth Engine.

1.  **Abrir el Code Editor de GEE:**
    Ve a [code.earthengine.google.com](https://code.earthengine.google.com/) e inicia sesión con tu cuenta de Google.

2.  **Copiar el Código Principal:**
    * En Visual Studio Code, abre el archivo `src/main.js`.
    * Selecciona todo el contenido del archivo (Ctrl+A o Cmd+A).
    * Copia el contenido (Ctrl+C o Cmd+C).

3.  **Crear un Nuevo Script en GEE:**
    * En el Code Editor de GEE, haz clic en `+ New > Script`.
    * Borra cualquier código preexistente en el nuevo script.
    * Pega el contenido que copiaste de `src/main.js` (Ctrl+V o Cmd+V).

4.  **Definir el Área de Interés (AOI):**
    * **Importante:** El script asume que la variable `aoi` ya está definida en tu entorno de GEE (por ejemplo, si has dibujado una geometría en el mapa y la has importado).
    * Si no has definido `aoi` o quieres usar un AOI predefinido, **descomenta la línea** `var aoi = ee.Geometry.Point([-73.045, -50.463]).buffer(20000);` en `main.js` antes de copiarlo, o define tu propia geometría directamente en el Code Editor de GEE (puedes dibujar un polígono y renombrar la variable a `aoi`).

5.  **Ejecutar el Script:**
    Haz clic en el botón `Run` en la parte superior del Code Editor de GEE.

6.  **Interactuar con la Interfaz:**
    * Una vez que el script se ejecute, verás un panel de UI en el lado izquierdo del mapa.
    * Utiliza el **slider** para navegar a través de las diferentes fechas y ver la clasificación de algas en el mapa.
    * El **panel de estadísticas** mostrará los porcentajes de probabilidad para la fecha seleccionada.
    * Observa el **gráfico de evolución temporal** en la pestaña `Console` para ver las tendencias a lo largo del período de estudio.
    * Usa el botón `Exportar imagen GeoTIFF actual` para descargar la imagen clasificada de la fecha actual a tu Google Drive.

## 4. Desarrollo y Colaboración

Si planeas modificar el código o colaborar:

1.  **Realiza cambios en tu VSC local** (en los archivos `.js` de `src/`).
2.  **Comprueba tus cambios en GEE** copiando el `main.js` actualizado al Code Editor y ejecutándolo.
3.  **Realiza commits regulares** a tu repositorio Git local.
4.  **Sube tus cambios a GitHub** (`git push origin main`) para mantener tu repositorio remoto actualizado y colaborar.

---

Este `setup_guide.md` es mucho más útil y proporciona instrucciones claras para que cualquier persona pueda ejecutar tu proyecto. No olvides guardar el archivo en VSC y luego agregarlo y hacerle commit a tu repositorio de Git y GitHub.