import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

/**
 * Install button component - shows when PWA can be installed
 * Appears in top-right after 2 seconds with custom prompt
 */
export function InstallButton() {
    const { isInstallable, isInstalled, install } = useInstallPrompt()
    const [showButton, setShowButton] = useState(false)

    // Show button after 2 seconds of page load (better UX)
    useEffect(() => {
        if (isInstallable) {
            const timer = setTimeout(() => setShowButton(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [isInstallable])

    if (isInstalled || !isInstallable || !showButton) return null

    return (
        <div
            className="fixed top-20 right-4 z-40 animate-in fade-in slide-in-from-top-2"
            role="button"
            tabIndex={0}
            onClick={install}
            onKeyDown={(e) => e.key === 'Enter' && install()}
            aria-label="Install LifeHub app"
        >
            <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border border-cyan-400/30">
                <Download className="w-4 h-4" />
                Instalar LifeHub
            </div>
        </div>
    )
}
