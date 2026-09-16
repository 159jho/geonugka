/* GEONUGKA | Aja — service worker
   IGBI – FIZBAC – UNTRM

   Dos cachés con políticas distintas:
   - SHELL: los archivos de la app. Se guardan al instalar, para que la app
     abra sin señal. Se sirven desde caché primero.
   - TILES: las teselas del mapa QUE YA VISITASTE, igual que haría el caché
     normal del navegador. No hay descarga masiva a propósito: las políticas
     de uso de OpenStreetMap y de los proveedores de imagen la prohíben.
     Para trabajar sin señal en una zona nueva hace falta un paquete PMTiles
     generado desde fuentes abiertas, que es lo previsto en la propuesta.
*/
const VER = 'geonugka-v1';
const SHELL = VER + '-shell';
const TILES = VER + '-tiles';
const TILES_MAX = 1200;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.js',
  'https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.css'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // uno por uno: si un recurso externo falla, la instalación no se cae
    await Promise.all(SHELL_FILES.map(u => c.add(u).catch(() => null)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.startsWith(VER)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isTile = url =>
  /tile\.openstreetmap\.org/.test(url) ||
  /server\.arcgisonline\.com/.test(url) ||
  /tiles\.maps\.eox\.at/.test(url);

async function trimTiles() {
  const c = await caches.open(TILES);
  const keys = await c.keys();
  if (keys.length > TILES_MAX) {
    for (let i = 0; i < keys.length - TILES_MAX; i++) await c.delete(keys[i]);
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  if (isTile(url)) {
    // teselas: primero la red, y si no hay señal, lo que ya se vio
    e.respondWith((async () => {
      const c = await caches.open(TILES);
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) { c.put(req, res.clone()); trimTiles(); }
        return res;
      } catch (err) {
        const hit = await c.match(req);
        if (hit) return hit;
        return new Response('', { status: 504, statusText: 'Sin señal y sin tesela en caché' });
      }
    })());
    return;
  }

  // app: primero la caché, para que abra al instante y sin señal
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok && new URL(url).origin === location.origin) {
        const c = await caches.open(SHELL);
        c.put(req, res.clone());
      }
      return res;
    } catch (err) {
      const fallback = await caches.match('./index.html');
      return fallback || new Response('Sin conexión', { status: 503 });
    }
  })());
});
