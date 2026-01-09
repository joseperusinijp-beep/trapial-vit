
/* sw.js — Service Worker simple para Trapial VIT */
const CACHE_NAME = 'trapial-vit-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
  // agrega aquí otros recursos estáticos: ./style.css, ./icons/icon-192.png, ./icons/icon-512.png, etc.
];

// Install: precache de recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// Activate: limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined))
      )
    ).then(self.clients.claim())
  );
});

// Fetch: estrategia cache-first con fallback a red
self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Cachea GET exitosos
        if (req.method === 'GET' && res && res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      }).catch(() => {
        // Fallback offline: si es navegación, devolvemos index
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

