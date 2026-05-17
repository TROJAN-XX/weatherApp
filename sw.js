/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'climaglass-cache-v1'

const urlsToCache = ['/', '/index.html', '/manifest.json']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }

          return null
        }),
      ),
    ),
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match('/index.html'))
      )
    }),
  )
})