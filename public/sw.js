// Service Worker with Network-First strategy for guaranteed updates
// Version timestamp ensures browser detects changes
const SW_VERSION = "2024-12-07-v4";
const CACHE_NAME = `world-flags-app-${SW_VERSION}`;
const FLAG_CACHE = "world-flags-images-v1"; // Keep flag images cached longer

// Static assets to pre-cache
const PRECACHE_ASSETS = ["/", "/index.html"];

// Install: pre-cache essentials and skip waiting immediately
self.addEventListener("install", (event) => {
  console.log(`[SW] Installing version ${SW_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Force activation - don't wait for old SW to finish
  self.skipWaiting();
});

// Activate: clean up ALL old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  console.log(`[SW] Activating version ${SW_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Keep only current app cache and flag images cache
            return name !== CACHE_NAME && name !== FLAG_CACHE;
          })
          .map((name) => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    }).then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "SW_UPDATED", version: SW_VERSION });
        });
      });
    })
  );
});

// Fetch: Network-first for app files, cache-first for external resources
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Flag images: Cache-first (they don't change)
  if (url.hostname === "flagcdn.com") {
    event.respondWith(
      caches.open(FLAG_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
              if (response.ok) {
                cache.put(event.request, response.clone());
              }
              return response;
          }).catch(() => {
            return new Response("", { status: 503 });
          });
        });
      })
    );
    return;
  }

  // Wikimedia images (coat of arms): Cache-first
  if (url.hostname === "upload.wikimedia.org") {
    event.respondWith(
      caches.open(FLAG_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => {
            return new Response("", { status: 503 });
            });
        });
      })
    );
    return;
  }

  // RestCountries API: Network-first with cache fallback
  if (url.hostname === "restcountries.com") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // App files (HTML, JS, CSS): NETWORK-FIRST - Always get fresh content
  // This is the key change that ensures updates are always fetched
  if (url.origin === self.location.origin) {
  event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Got fresh response - cache it
        if (response.ok) {
          const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
        })
        .catch(() => {
          // Network failed - serve from cache (offline support)
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page for navigation requests
            if (event.request.mode === "navigate") {
              return caches.match("/index.html");
            }
            return new Response("Offline", { status: 503 });
      });
    })
    );
    return;
  }

  // Other requests: Network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Handle messages from the app
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
  if (event.data === "getVersion") {
    event.ports[0].postMessage({ version: SW_VERSION });
  }
});
