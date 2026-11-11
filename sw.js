// Recession Monitor service worker. Version: 15f89afc17
const CACHE = 'grm-15f89afc17';
const SHELL = ['./', 'index.html', 'vendor/d3.min.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'meta.json', 'data/countries.json', 'data/links.json', 'data/alerts.json', 'data/markets.json', 'data/indicators.json'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first (fresh data when online), cached copy when offline.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const key = new URL(req.url); key.search = '';
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key.href, copy)); }
      return res;
    }).catch(() => caches.match(key.href).then((r) => r || caches.match('index.html')))
  );
});
