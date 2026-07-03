const CACHE='inju-v3-alpha-1';
const FILES=['./','./index.html','./css/style.css','./js/app.js','./data/geolmaeri.json','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
