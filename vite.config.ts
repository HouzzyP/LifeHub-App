import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-*.png'],
            manifest: {
                name: 'LifeHub - Life & Gym Tracker',
                short_name: 'LifeHub',
                description: 'Your all-in-one life, habit, gym tracker & notes hub',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                orientation: 'portrait-primary',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                categories: ['productivity', 'lifestyle'],
                screenshots: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        form_factor: 'narrow'
                    }
                ],
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https?:\/\/localhost:.*\.(js|css|svg|woff2?)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'assets-cache',
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /^https?:\/\/localhost:.*\.(?:png|jpg|jpeg|gif|webp)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        allowedHosts: ['7fb0-2800-2222-41-b0c4-f479-4e9a-797e-dcb9.ngrok-free.app']
    }
})
