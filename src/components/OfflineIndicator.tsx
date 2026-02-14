import { useOnline } from '../hooks/useOnline'
import { WifiOff } from 'lucide-react'

/**
 * Offline indicator banner
 * Shows when connection is lost or data is being synced
 */
export function OfflineIndicator() {
    const isOnline = useOnline()

    if (isOnline) return null

    return (
        <div
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-2"
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm border border-amber-400/30 shadow-lg">
                <WifiOff className="w-5 h-5 text-white flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-white">You're offline</p>
                    <p className="text-xs text-white/80">Changes will sync when reconnected</p>
                </div>
            </div>
        </div>
    )
}

/**
 * Sync status indicator
 * Shows when syncing pending changes
 */
export function SyncIndicator({ isSyncing }: { isSyncing: boolean }) {
    if (!isSyncing) return null

    return (
        <div
            className="fixed top-4 right-4 z-40"
            role="status"
            aria-live="polite"
            aria-label="Syncing changes"
        >
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-cyan-600 bg-cyan-50 rounded-full border border-cyan-200 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                Syncing...
            </div>
        </div>
    )
}
