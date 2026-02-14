/**
 * Sync manager for handling offline changes
 * Tracks pending database operations that would sync to a backend when online
 */

interface SyncQueue {
    type: 'note' | 'habit'
    action: 'create' | 'update' | 'delete'
    timestamp: number
    data: Record<string, unknown>
}

class DexieSyncManager {
    private syncQueue: SyncQueue[] = []
    private isSyncing = false
    private syncListeners: Set<(isSyncing: boolean) => void> = new Set()

    /**
     * Add entry to sync queue
     * Since there's no backend, this tracks pending changes for eventual cloud sync
     */
    async queueSync(
        type: 'note' | 'habit',
        action: 'create' | 'update' | 'delete',
        data: Record<string, unknown>
    ) {
        const entry: SyncQueue = {
            type,
            action,
            timestamp: Date.now(),
            data
        }

        this.syncQueue.push(entry)
        console.log(`[Sync] Queued ${type} ${action}:`, data)

        // In offline mode, changes are already in IndexedDB
        // The queue here represents what would need to sync to a backend
    }

    /**
     * Attempt to sync queued changes
     * Useful for when backend API is available
     */
    async performSync(): Promise<{
        synced: number
        failed: number
        queue: SyncQueue[]
    }> {
        if (this.isSyncing || this.syncQueue.length === 0) {
            return { synced: 0, failed: 0, queue: this.syncQueue }
        }

        this.isSyncing = true
        this.notifyListeners()

        try {
            const results = {
                synced: 0,
                failed: 0,
                queue: this.syncQueue
            }

            for (const entry of this.syncQueue) {
                try {
                    // Entry point for future backend sync API
                    // Example:
                    // if (entry.type === 'note' && entry.action === 'update') {
                    //   await fetch('/api/notes/' + entry.data.id, {
                    //     method: 'PATCH',
                    //     body: JSON.stringify(entry.data)
                    //   })
                    // }

                    console.log(`[Sync] Would sync to backend:`, entry)
                    results.synced++
                } catch (error) {
                    console.error(`[Sync] Failed to sync ${entry.type}:`, error)
                    results.failed++
                }
            }

            if (results.failed === 0) {
                this.syncQueue = []
                console.log(`[Sync] Successfully synced ${results.synced} items`)
            }

            return results
        } finally {
            this.isSyncing = false
            this.notifyListeners()
        }
    }

    /**
     * Subscribe to sync status changes
     */
    onSyncStateChange(listener: (isSyncing: boolean) => void): () => void {
        this.syncListeners.add(listener)
        return () => this.syncListeners.delete(listener)
    }

    private notifyListeners() {
        this.syncListeners.forEach(listener => listener(this.isSyncing))
    }

    /**
     * Get current sync queue
     */
    getQueue(): SyncQueue[] {
        return [...this.syncQueue]
    }

    /**
     * Clear sync queue (after successful cloud sync)
     */
    clearQueue() {
        this.syncQueue = []
    }

    /**
     * Get sync statistics
     */
    getStats() {
        return {
            queueLength: this.syncQueue.length,
            isSyncing: this.isSyncing,
            lastEntry: this.syncQueue[this.syncQueue.length - 1]
        }
    }
}

export const syncManager = new DexieSyncManager()

/**
 * Hook for accessing sync manager state
 */
export function useSyncManager() {
    return {
        queue: syncManager.getQueue(),
        stats: syncManager.getStats(),
        performSync: () => syncManager.performSync(),
        subscribe: (listener: (isSyncing: boolean) => void) =>
            syncManager.onSyncStateChange(listener)
    }
}
