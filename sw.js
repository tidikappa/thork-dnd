// === Service Worker — Assistant D&D Thork ===
// Stratégie :
//   - Network-first pour le HTML (pour récupérer les mises à jour à chaque ouverture)
//   - Cache-first pour les assets statiques (CDN React/Tailwind/fonts)
//   - Offline fallback : sert la dernière version cachée si pas de réseau
//
// Pour pousser une mise à jour : change la valeur de CACHE_VERSION ci-dessous,
// puis ré-uploade le sw.js. Les utilisateurs recevront la nouvelle version
// au prochain chargement (ou au plus tard 24h après).

const CACHE_VERSION = 'thork-pwa-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Assets locaux à pré-cacher dès l'install (pour offline immédiat)
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon.png',
];

// Ressources externes (CDN) qu'on cache à la volée (runtime)
const RUNTIME_DOMAINS = [
  'cdn.tailwindcss.com',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// === INSTALL : pré-cache des assets locaux ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] Precache partial:', err))
  );
});

// === ACTIVATE : nettoyage des vieilles caches ===
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// === FETCH ===
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) HTML / navigation : network-first (pour mises à jour)
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 2) Same-origin assets locaux : cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(req, clone));
        return res;
      }))
    );
    return;
  }

  // 3) Domaines CDN whitelistés : cache-first avec mise à jour en arrière-plan (stale-while-revalidate)
  if (RUNTIME_DOMAINS.some((d) => url.hostname.includes(d))) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const fetchPromise = fetch(req).then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // 4) Reste : network passthrough
});

// === Message : permet de forcer skipWaiting depuis l'app (mises à jour instantanées) ===
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
