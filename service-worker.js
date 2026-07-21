const CACHE='chitransh-v4-luxury';
const ASSETS=["./", "./index.html", "./style.css", "./script.js", "./manifest.json", "./contact.vcf", "./logo.png", "./hero.webp", "./icon-192.png", "./icon-512.png", "./photo-01.webp", "./photo-02.webp", "./photo-03.webp", "./photo-04.webp", "./photo-05.webp", "./photo-06.webp", "./photo-07.webp", "./photo-08.webp", "./photo-09.webp", "./photo-10.webp", "./photo-11.webp", "./photo-12.webp", "./photo-13.webp", "./photo-14.webp", "./photo-15.webp", "./photo-16.webp", "./photo-17.webp", "./photo-18.webp", "./photo-19.webp", "./photo-20.webp"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;
  }).catch(()=>caches.match('./index.html'))));
});
