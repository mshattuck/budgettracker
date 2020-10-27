
console.log("Hello from your service worker!");

const FILES_TO_CACHE = [
    "/",
    "/index.js",
    "manifest.webmanifest",
    "styles.css",
    "icons/icon-192x192.png",
    "/icons/icon-512x512.png"

    ];

//install
self.addEventListener("install", event =>
{  
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});

self.addEventListener("activate", event => 
{


    
});


self.addEventListener("fetch", event => 
{



});