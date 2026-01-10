
// sw.js
const CACHE_NAME = 'trapial-vit-v3.1'; // ¡incrementar en cada despliegue!
const ASSETS = [
  './index.html', // incluir el HTML principal
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/app.css',
  './assets/app.js'
];

// Install: precache básicos
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

// Activate: borrar caches viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
  );
});

// Fetch: network-first para HTML; cache-first para estáticos
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';

  if (req.mode === 'navigate' || accept.includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy));
      return res;
    }))
  );
});
``



















