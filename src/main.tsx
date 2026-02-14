import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/main.css'
import { syncManager } from './db/syncManager'

// Register service worker for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register(
                new URL('./sw.ts', import.meta.url),
                { scope: '/' }
            )
            console.log('[PWA] Service Worker registered:', registration.scope)

            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] New service worker available - refresh to update')
                        }
                    })
                }
            })
        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error)
        }
    })
}

// Listen for online status changes and attempt sync
window.addEventListener('online', () => {
    console.log('[PWA] Online detected - attempting sync...')
    syncManager.performSync()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

