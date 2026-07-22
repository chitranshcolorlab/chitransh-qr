const CACHE = 'chitransh-v6-booking-20260722';
const CORE = [
  './', './index.html', './manifest.json', './contact.vcf',
  './assets/css/style.css', './assets/js/script.js',
  './assets/images/branding/logo.png', './assets/images/branding/hero.webp',
  './assets/images/founder/sharad-mathur.png',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
