import { useState, useEffect } from 'react'

/**
 * Hook to detect online/offline status with debounce
 * Listens to window online/offline events
 */
export function useOnline() {
    const [isOnline, setIsOnline] = useState(() => navigator.onLine)

    useEffect(() => {
        // Debounce timeout for status changes
        let debounceTimer: ReturnType<typeof setTimeout> | null = null

        const handleOnline = () => {
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                setIsOnline(true)
                console.log('[PWA] Online detected')
            }, 500)
        }

        const handleOffline = () => {
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                setIsOnline(false)
                console.log('[PWA] Offline detected')
            }, 500)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            if (debounceTimer) clearTimeout(debounceTimer)
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return isOnline
}
