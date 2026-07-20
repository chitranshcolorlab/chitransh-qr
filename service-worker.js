const CACHE='chitransh-v1';
const ASSETS=["./", "./index.html", "./style.css", "./script.js", "./manifest.json", "./contact.vcf", "./assets/logo.png", "./assets/hero.webp", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/gallery/photo-01.webp", "./assets/gallery/photo-02.webp", "./assets/gallery/photo-03.webp", "./assets/gallery/photo-04.webp", "./assets/gallery/photo-05.webp", "./assets/gallery/photo-06.webp", "./assets/gallery/photo-07.webp", "./assets/gallery/photo-08.webp", "./assets/gallery/photo-09.webp", "./assets/gallery/photo-10.webp", "./assets/gallery/photo-11.webp", "./assets/gallery/photo-12.webp", "./assets/gallery/photo-13.webp", "./assets/gallery/photo-14.webp", "./assets/gallery/photo-15.webp", "./assets/gallery/photo-16.webp", "./assets/gallery/photo-17.webp", "./assets/gallery/photo-18.webp", "./assets/gallery/photo-19.webp", "./assets/gallery/photo-20.webp"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;
  }).catch(()=>caches.match('./index.html'))));
});
