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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,420px)] animate-in fade-in slide-in-from-bottom-2">
            <button
                onClick={tryInstall}
                className="premium-button w-full flex items-center justify-center gap-2 rounded-2xl"
                aria-label="Instalar LifeHub"
            >
                <Download className="w-4 h-4" />
                Instalar LifeHub
            </button>
        </div>
    )
}
