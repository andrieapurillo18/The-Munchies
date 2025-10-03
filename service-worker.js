const CACHE_NAME = 'bookkeeping-app-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  // add any CSS or image files if you have them
];

// Install event – cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Activate new SW immediately
});

// Activate event – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of all pages immediately
});

// Fetch event – serve cached assets first, then network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // optional: fallback content if offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
