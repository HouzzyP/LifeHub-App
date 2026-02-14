/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

/**
 * LifeHub Service Worker
 * Handles caching, offline support, and background sync
 */

const CACHE_NAME = 'lifehub-cache-v1'
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/pwa-icon-192.svg',
    '/pwa-icon-512.svg'
]

// Install event: Cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker')
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets')
            return cache.addAll(STATIC_ASSETS).then(() => self.skipWaiting())
        })
    )
})

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker')
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => {
                        console.log('[SW] Deleting old cache:', cacheName)
                        return caches.delete(cacheName)
                    })
            )
        }).then(() => self.clients.claim())
    )
})

// Fetch event: Serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    const { request } = event

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // Cache hit - return cached response
            if (cachedResponse) {
                return cachedResponse
            }

            // Cache miss - fetch from network
            return fetch(request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response
                    }

                    // Clone the response to cache it
                    const cachedClone = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, cachedClone)
                    })

                    return response
                })
                .catch(() => {
                    // Network failed - check if it's a document request
                    if (request.destination === 'document') {
                        // Return a simple offline page
                        return new Response(
                            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>You are offline</h1><p>LifeHub continues to work with your cached data.</p></body></html>',
                            { headers: { 'Content-Type': 'text/html' } }
                        )
                    }

                    // Return empty response for other requests
                    return new Response('', { status: 503, statusText: 'Service Unavailable' })
                })
        })
    )
})

// Handle messages from app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Skipping waiting')
        self.skipWaiting()
    }
})

export { }
