const CACHE_NAME = "codevault-v2";
const ASSETS = ["./","./home.html","./logo.png","./manifest.json"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e=>{
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./home.html"))));
  } else {
    e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{caches.open(CACHE_NAME).then(cache=>cache.put(e.request,r.clone()));return r})));
  }
});