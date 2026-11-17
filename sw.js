/* Tandem offline shell. Generated at build time: d7f287a5a8af */
const CACHE = 'tandem-shell-d7f287a5a8af';
const FILES = ["./","apple-touch-icon.png","assets/bricolage-grotesque-latin-ext-opsz-normal-IcJDqblK.woff2","assets/bricolage-grotesque-latin-opsz-normal-Cre6nC2_.woff2","assets/bricolage-grotesque-vietnamese-opsz-normal-D9N6E8K1.woff2","assets/index-B94cdDrw.js","assets/index-Bo8FYtW_.css","assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2","assets/inter-cyrillic-wght-normal-DqGufNeO.woff2","assets/inter-greek-ext-wght-normal-DlzME5K_.woff2","assets/inter-greek-wght-normal-CkhJZR-_.woff2","assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","assets/inter-latin-wght-normal-Dx4kXJAl.woff2","assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2","favicon.ico","icon-192.png","icon-512.png","icon-maskable-512.png","icon.svg","manifest.webmanifest"];
// Hosts often add a Vary header (Origin, Accept-Encoding). The cached copy is right regardless, so ignore it.
const MATCH = { ignoreSearch: true, ignoreVary: true };

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(FILES.map((f) => cache.add(new Request(f, { cache: 'reload' })).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('tandem-shell-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only the app's own files are cached. Google sign-in and Drive calls always go to the network.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/config.json')) return;

  if (req.mode === 'navigate') {
    // Fresh page when online, cached shell when offline.
    event.respondWith(fetch(req).catch(() => caches.match('./', MATCH).then((r) => r || Response.error())));
    return;
  }
  event.respondWith(
    caches.match(req, MATCH).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && url.pathname.includes('/assets/')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
