const CACHE_NAME = 'plano-aula-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/plano_gerado.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  console.log('[Service Worker] Instalado');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).then(res =>
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        })
      )
    ).catch(() => {
      return new Response("Você está offline e este recurso não foi salvo ainda.");
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});