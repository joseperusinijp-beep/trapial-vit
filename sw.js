
// sw.js
const CACHE_NAME = 'trapial-vit-v7'; // subir versión en cada despliegue
const ASSETS = ['./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',(e)=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',(e)=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))))});
self.addEventListener('fetch',(e)=>{
  const req=e.request,accept=req.headers.get('accept')||'';
  if(req.mode==='navigate'||accept.includes('text/html')){
    e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));return res}).catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(c=>c||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));return res})));
});






















