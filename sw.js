
// sw.js
const CACHE_NAME = 'trapial-vit-v3';
const ASSETS = [
  './',
  './index (2).html',
  './manifest.json',
  './assets/chevron-hallmark.svg',
  './icons/favicon.ico',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  './icons/apple-touch-icon.png',
  './icons/android-chrome-192x192.png',
  './icons/android-chrome-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
