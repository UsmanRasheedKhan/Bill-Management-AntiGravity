// public/sw.js — Basic service worker for offline caching (PWA)
const CACHE_NAME = "construction-bill-mgr-v1";
const STATIC_ASSETS = ["/", "/bills", "/bills/new", "/reports", "/manifest.json"];

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Network-first for API/Firebase, cache-first for static assets
    if (event.request.url.includes("firestore.googleapis.com") ||
        event.request.url.includes("googleapis.com")) {
        return; // Let Firebase handle its own requests
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                if (response.ok && event.request.method === "GET") {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => cached);
        })
    );
});
