
const CACHE="sprachwerk-v24";
const ASSETS=["./","./index.html","./app.css","./app.js","./data.js","./language.css","./language.js","./grammar-expanded.js","./verbs-data.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return resp;
  }).catch(()=>caches.match("./index.html"))));
});
