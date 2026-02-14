import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './styles/main.css'
import { syncManager } from './db/syncManager'

// Register the generated service worker in production
registerSW({
    onRegistered(swUrl, registration) {
        if (registration) {
            console.log('[PWA] Service Worker registered:', swUrl)
        }
    },
    onNeedRefresh() {
        console.log('[PWA] New service worker available - refresh to update')
    },
    onOfflineReady() {
        console.log('[PWA] App ready to work offline')
    }
})

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

