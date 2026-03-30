const CACHE='guduzoulang-v20250329';
const URLS=[
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  // Network-first for index.html — always get fresh version
  if(e.request.url.includes('index.html')||e.request.url.endsWith('/')){
    e.respondWith(fetch(e.request).then(resp=>{
      if(resp.ok){const c=resp.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c))}
      return resp;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  // Cache-first for everything else (fonts, etc.)
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp.ok){const c=resp.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c))}
    return resp;
  }).catch(()=>caches.match('./index.html'))));
});
