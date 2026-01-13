
// sw.js - tolerante a assets faltantes
const CACHE_NAME = 'trapial-vit-v4';
const ASSETS = [
  './',
  './index (2).html',
  './manifest.json',
  './site.webmanifest', // por si hay referencias viejas
  // posibles ubicaciones de logos/iconos
  './Logo chevron.png',
  './icon-192.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './icons/android-chrome-192x192.png',
  './icons/android-chrome-512x512.png',
  './icons/apple-touch-icon.png',
  './apple-touch-icon.png'
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
