import { useEffect, useState } from 'react'
import { INSTALL_MESSAGES } from '../constants/ui'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Hook to detect PWA install capability
 * Uses native beforeinstallprompt event - works when browser has PWA criteria met
 * Falls back to manual installation instructions if event doesn't fire
 */
export function usePWAInstall() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [canInstall, setCanInstall] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if already installed (display-mode: standalone)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Check if user dismissed install prompt
        const wasDismissed = localStorage.getItem('pwa-install-dismissed') === 'true'
        if (wasDismissed) {
            setDismissed(true)
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e as BeforeInstallPromptEvent)
            setCanInstall(true)
            console.log('[PWA] Install prompt ready')
        }

        const handleAppInstalled = () => {
            console.log('[PWA] App installed!')
            setIsInstalled(true)
            setCanInstall(false)
            setInstallPrompt(null)
            localStorage.removeItem('pwa-install-dismissed')
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const install = async () => {
        if (!installPrompt) return

        try {
            await installPrompt.prompt()
            const { outcome } = await installPrompt.userChoice
            console.log('[PWA] Installation outcome:', outcome)

            if (outcome === 'accepted') {
                setIsInstalled(true)
            } else {
                // User rejected - remember this
                localStorage.setItem('pwa-install-dismissed', 'true')
                setDismissed(true)
            }

            setInstallPrompt(null)
            setCanInstall(false)
        } catch (error) {
            console.error('[PWA] Install error:', error)
        }
    }

    // Try to install, or show fallback message
    const tryInstall = async () => {
        if (installPrompt) {
            await install()
        } else {
            // beforeinstallprompt didn't fire, show manual instructions
            alert(INSTALL_MESSAGES.fallbackInstructions)
        }
    }

    const dismiss = () => {
        localStorage.setItem('pwa-install-dismissed', 'true')
        setDismissed(true)
        setCanInstall(false)
    }

    return {
        canInstall: canInstall && !dismissed && !isInstalled,
        isInstalled,
        install,
        tryInstall,
        dismiss,
        hasPrompt: !!installPrompt
    }
}
