# GEONUGKA | Aja — cómo ejecutarla en el celular

IGBI – FIZBAC – UNTRM · prototipo de campo

Esta carpeta contiene la app completa. Son cinco archivos y **todos deben quedar juntos en la misma carpeta**:

```
index.html              la aplicación
manifest.webmanifest    lo que la hace instalable
sw.js                   lo que la hace funcionar sin señal
icon-192.png
icon-512.png
icon-maskable-512.png
```

---

## Lo primero que hay que entender

El navegador **solo entrega la ubicación GPS a páginas servidas por HTTPS** (o desde `localhost`). Por eso, descargar `index.html` al celular y abrirlo desde la carpeta de Descargas **no sirve**: se ve el mapa, pero el GPS queda bloqueado.

La solución es publicar la carpeta en una dirección con HTTPS. Es gratis y toma unos quince minutos una sola vez.

---

## Opción A — GitHub Pages (recomendada, gratis y permanente)

Es la ruta que además deja el repositorio público que la propuesta prevé abrir desde el primer mes.

1. Crea una cuenta en **github.com** si no la tienes.
2. **New repository** → nombre `geonugka` → marca **Public** → *Create repository*.
3. **Add file → Upload files** → arrastra los seis archivos de esta carpeta → *Commit changes*.
4. **Settings → Pages** → en *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` → *Save*.
5. Espera uno o dos minutos. Tu dirección será:
   `https://TU-USUARIO.github.io/geonugka/`
6. Abre esa dirección **en el celular**.
7. **Android (Chrome):** menú de tres puntos → *Añadir a pantalla de inicio* (o pulsa el botón **Instalar** que aparece en la barra de la app).
   **iPhone (Safari):** botón Compartir → *Añadir a pantalla de inicio*.

Queda con su ícono propio y abre a pantalla completa, sin barra del navegador.

## Opción B — Netlify Drop (dos minutos, sin crear repositorio)

Entra a **app.netlify.com/drop** y arrastra la carpeta completa. Te devuelve una dirección HTTPS al instante. Sirve perfecto para probar; para algo permanente conviene la Opción A.

## Opción C — Solo para una prueba rápida en la misma red Wi-Fi

En la laptop, dentro de esta carpeta:

```
python3 -m http.server 8000
```

Averigua la IP de la laptop (`ipconfig` en Windows, `ip a` en Linux) y en el celular abre `http://192.168.x.x:8000`.

**El mapa funciona, el GPS no**, porque es HTTP y no HTTPS. Sirve para revisar la interfaz, no para medir un potrero.

---

## Permisos en el celular

Cuando pulses **Caminar GPS**, el navegador pedirá permiso de ubicación. Elige:

- **Permitir mientras se usa la app**
- **Ubicación precisa** activada (en Android aparece como *Precise / Exacta*)

Si por error elegiste *Bloquear*, se corrige en: Chrome → candado en la barra de dirección → Permisos → Ubicación.

Consejo de campo: espera a que el indicador muestre **±5 m o mejor** antes de empezar a caminar el lindero. Al salir del auto o de una casa, el primer arreglo del GPS suele ser malo durante el primer minuto.

---

## Qué funciona sin señal, una vez instalada

| Funciona | No funciona |
|---|---|
| Abrir la app y usar el formulario | Ver una zona **nueva** del mapa por primera vez |
| El GPS del celular (no necesita internet) | |
| Calcular superficie, perímetro y carga animal | |
| Los potreros ya guardados | |
| Las teselas del mapa de zonas **que ya visitaste** | |

Antes de salir a una zona sin cobertura, recorre esa área en el mapa con wifi para que las teselas queden guardadas.

**Aviso honesto:** esto no es lo mismo que un paquete de mapas descargado. La app guarda solo lo que ya viste, porque las políticas de uso de OpenStreetMap y de los proveedores de imagen prohíben la descarga masiva de teselas. El trabajo sin señal de verdad, para un distrito completo, necesita los paquetes **PMTiles** generados desde fuentes abiertas que están previstos en la propuesta.

---

## Dónde quedan los datos

En el almacenamiento del navegador del propio celular. No se suben a ningún servidor: este prototipo todavía no tiene el backend de sincronización.

**Exporta seguido.** Desde el botón *Potreros* puedes descargar **GeoJSON** (para QGIS o ArcGIS) y **KML** (para Google Earth). Si borras los datos de navegación del celular o desinstalas la app, los registros se pierden.

---

## Si algo falla

| Síntoma | Causa y solución |
|---|---|
| No aparece el botón *Instalar* | Solo lo muestra Chrome en Android y solo sobre HTTPS. En iPhone se usa Compartir → Añadir a pantalla de inicio. |
| El mapa sale gris | Sin internet en la primera carga, o el proveedor de teselas no responde. Prueba otra capa en el selector de arriba. |
| «No se pudo leer la ubicación» | Estás en HTTP o en un archivo local. Ver la nota del inicio. |
| La capa Sentinel-2 no carga | El identificador del año en la dirección del servicio de EOX cambia con cada versión anual. Usa Esri o OpenStreetMap mientras se ajusta. |
| Cambié de capa y desaparecieron los polígonos | Vuelve a cargar la página; los datos guardados no se pierden. |

---

## Lo que todavía no es

Un prototipo, no la versión 1.0. Falta el servidor de sincronización, la carga de fotos geoetiquetadas, el empaquetado con Capacitor para Play Store y F-Droid, y los paquetes de mapas sin conexión. El modelo de datos y los cálculos sí son los definitivos de la propuesta.

Los coeficientes zootécnicos (1 UA = 450 kg, consumo 13,5 kg MS/día, utilización 55 %) deben ser validados por el equipo del IGBI antes de usar los resultados para tomar decisiones de manejo.
