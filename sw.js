
// sw.js — precache minimal de tu app e imágenes en /logo
// No altera lógica de cálculo. Solo asegura carga del index y logos.
// Si cambias el nombre del index, ajusta las rutas aquí también.

const CACHE_NAME = 'trapial-vit-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // logos en /logo (los que me pasaste)
  './logo/logo-chevron.png',
  './logo/icon-192.png',
  './logo/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        ASSETS.map(async (url) => {
          try { await cache.add(url); } catch (e) { /* ignoramos faltantes para no romper */ }
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
