// Service worker: lets CloudCover install as an app and open the page shell offline.
// Customer data (/api) is NEVER cached on the device - it always comes fresh from the server.

const CACHE = 'cloudcover-v3';
const SHELL = [
    'index.html', 'login.html', 'portal.html', 'dashboard.html',
    'css/style.css', 'css/components.css', 'css/dashboard.css', 'css/portal.css',
    'js/app.js', 'js/auth.js', 'js/portal.js', 'js/dashboard.js',
    'js/customers.js', 'js/policies.js', 'js/investments.js',
    'js/team.js', 'js/account.js', 'js/search.js', 'js/cognito.js',
    'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // Never cache API data or the login callback (its address holds a one-time login code)
    if (event.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')
        || url.pathname === '/auth-callback.html') {
        return; // let the browser handle it normally
    }

    // Network first, so updates show up straight away; fall back to the cached copy when offline
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches.open(CACHE).then(cache => cache.put(event.request, copy));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
