// GeoOlympics — Service Worker (online-only PWA)
const CACHE_NAME = 'geoolympics-v1';
const BASE = '/geoolympics';

// Apenas o shell da aplicação é cacheado para permitir instalação
const SHELL_ASSETS = [
  BASE + '/',
  BASE + '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estratégia: Network First — sempre busca da rede, sem cache de conteúdo dinâmico
self.addEventListener('fetch', event => {
  // Deixa o Firebase e Cloudinary passarem direto
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
