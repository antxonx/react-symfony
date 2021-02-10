// This is the "Offline copy of assets" service worker

const CACHE = "pwabuilder-offline";
const CACHED = "pwabuilder-offline-stored";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp(/\/api\/*/),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE
  })
);

workbox.routing.registerRoute(
  new RegExp(/\/(?!api).*/),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHED
  })
);