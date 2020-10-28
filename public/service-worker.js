
console.log("Hello from your service worker!");

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

const FILES_TO_CACHE = [
    "/",
    "/app.js",
    "/index.js",
    "manifest.webmanifest",
    "styles.css",
    "icons/icon-192x192.png",
    "/icons/icon-512x512.png"

    ];

//install service worker
self.addEventListener("install", event =>
{  
    event.waitUntil(caches.open(PRECACHE)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting()));
});

//activate
self.addEventListener("activate", event => 
{
    //const activeCaches = [PRECACHE, RUNTIME];

    evt.waitUntil(
        caches.keys().then(keyList => 
            {
                return Promise.all(keyList.map(key => 
                    {
                        if (key !== PRECACHE && key !== RUNTIME) 
                        {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                         }
                    }));
            }));
      self.clients.claim();    
});

//fetch
self.addEventListener("fetch", event => 
{
    const {url} = evt.request;
    if (url.includes("/all") || url.includes("/find")) {
      evt.respondWith(
        caches.open(RUNTIME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
    } else {
      // respond from static cache, request is not for /api/*
      evt.respondWith(
        caches.open(PRECACHE).then(cache => {
          return cache.match(evt.request).then(response => {
            return response || fetch(evt.request);
          });
        })
      );
    }
  });