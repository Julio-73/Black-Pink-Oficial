// BLACKPINK Fan Hub — Service Worker
const CACHE = 'bp-fan-hub-v1';
const PRECACHE = [
  './',
  './index.html',
  './page.css',
  './manifest.json',
  './img/pwa/icon-192.png',
  './img/pwa/icon-512.png',
  './js/main.js',
  './js/toast.js',
  './js/nav.js',
  './js/modals.js',
  './js/videos.js',
  './js/cart.js',
  './js/forms.js',
  './js/countdown.js',
  './js/map.js',
  './js/effects.js',
  './js/player.js',
  './js/quiz.js',
  './js/lightstick.js',
  './css/lightstick.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok && (res.type === 'basic' || res.type === 'default')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
