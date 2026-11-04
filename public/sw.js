const CACHE_NAME = 'world-top-news-v2.0';
const DYNAMIC_CACHE = 'wtn-dynamic-v2.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/@ionic/core@8.4.1/css/ionic.bundle.css',
  'https://cdn.jsdelivr.net/npm/@ionic/core@8.4.1/dist/ionic/ionic.esm.js',
  'https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.esm.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA SW] Pre-caching static app shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA SW] Some assets failed to pre-cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[PWA SW] Removing legacy cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests
  if (req.method !== 'GET') return;

  // 1. News API Requests: Network-First with Cache Fallback
  if (url.hostname.includes('newsdata.io') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          console.log('[PWA SW] Network failed, serving cached news API response');
          return caches.match(req).then((cachedRes) => {
            if (cachedRes) return cachedRes;
            return new Response(
              JSON.stringify({
                status: 'offline',
                results: [],
                message: 'You are currently offline. Connect to internet to read latest live news.'
              }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // 2. Images: Cache-First with Network Fallback
  if (req.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif)$/i)) {
    event.respondWith(
      caches.match(req).then((cachedImage) => {
        if (cachedImage) return cachedImage;
        return fetch(req)
          .then((networkImage) => {
            if (networkImage && networkImage.status === 200) {
              const clone = networkImage.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => cache.put(req, clone));
            }
            return networkImage;
          })
          .catch(() => {
            // Return fallback SVG image if image fetch fails
            return caches.match('/icons/icon.svg');
          });
      })
    );
    return;
  }

  // 3. Static App Shell & Scripts: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
