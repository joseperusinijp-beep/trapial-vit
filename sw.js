
// sw.js
const CACHE_NAME = 'trapial-vit-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // logos en /logo
  './logo/logo-chevron.png',
  './logo/logo%20chevron.png',  // fallback si no renombrás
  './logo/icon-192.png',
  './logo/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        ASSETS.map(async (url) => {
          try { await cache.add(url); } catch (e) { /* ignorar faltantes */ }
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
