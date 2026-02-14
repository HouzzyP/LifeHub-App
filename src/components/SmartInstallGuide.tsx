import { Download } from 'lucide-react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { usePWAInstall } from '../hooks/usePWAInstall'

/**
 * Simple install guide - shows how to add to home screen
 * Works on any Android browser
 */
export function SmartInstallGuide() {
    const device = useDeviceDetection()
    const { tryInstall, isInstalled } = usePWAInstall()

    // Check if it's a mobile device and not already installed as app
    const isMobile = device.platform === 'android' || device.platform === 'ios'
    const isAlreadyInstalled = device.isStandalone || isInstalled

    if (!isMobile || isAlreadyInstalled) return null

    const showInstallButton = device.platform === 'android'
    if (!showInstallButton) return null

    return (
        <div className="fixed bottom-20 right-4 z-40 animate-in fade-in slide-in-from-bottom-2">
            <button
                onClick={tryInstall}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(129, 140, 248, 0.15) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: 'var(--accent)'
                }}
                aria-label="Instalar LifeHub"
            >
                <Download className="w-4 h-4" />
                <span>Instalar</span>
            </button>
        </div>
    )
}
