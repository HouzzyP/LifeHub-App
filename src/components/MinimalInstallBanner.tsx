import { Download, X } from 'lucide-react'
import { usePWAInstall } from '../hooks/usePWAInstall'

/**
 * Minimal install banner - only shows when beforeinstallprompt is available
 * Non-intrusive, appears at bottom of screen, can be dismissed
 */
export function MinimalInstallBanner() {
    const { canInstall, install, dismiss } = usePWAInstall()

    if (!canInstall) return null

    return (
        <div
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 animate-in fade-in slide-in-from-bottom-2"
            role="status"
            aria-live="polite"
            aria-label="Install app banner"
        >
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 backdrop-blur-sm border border-blue-400/30 shadow-lg">
                <Download className="w-4 h-4 text-white flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Instalar LifeHub como app</p>
                </div>
                <button
                    onClick={install}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                    Instalar
                </button>
                <button
                    onClick={dismiss}
                    className="p-1 text-white/70 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Cerrar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
