
console.log("Hello from your service worker!");

const PRE_CACHE = "precache-v1";
const RUNTIME_CACHE = "runtime-cache";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "manifest.webmanifest",
    "/styles.css",
    "/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
    ];

//install service worker
self.addEventListener("install", event =>
{  
    event.waitUntil(caches.open(PRE_CACHE)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting()));
});

//activate
self.addEventListener("activate", event => 
{
    const activeCaches = [PRE_CACHE, RUNTIME_CACHE];
   
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          // return array of cache names that are old to delete
          return cacheNames.filter(
            cacheName => !activeCaches.includes(cacheName)
          );
        })
        .then(cachesToDelete => {
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
});

//fetch
self.addEventListener("fetch", event => {
    if (event.request.url.startsWith(self.location.origin)) 
    {
      // use cache first for all other requests for performance
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          // request is not in cache. make network request and cache the response
          return caches.open(RUNTIME_CACHE).then(cache => {
            return fetch(event.request).then(response => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });