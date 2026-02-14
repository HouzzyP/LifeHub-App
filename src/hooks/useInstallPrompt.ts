import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Hook to manage PWA installation
 * Triggered by beforeinstallprompt event from browser
 */
export function useInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if already installed as standalone app
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        if (isStandalone) {
            setIsInstalled(true)
            return
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
            console.log('[PWA] Install prompt available')
        }

        const handleAppInstalled = () => {
            console.log('[PWA] App installed!')
            setIsInstalled(true)
            setIsInstallable(false)
            setInstallPrompt(null)
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
            console.log('[PWA] User response:', outcome)

            if (outcome === 'accepted') {
                setIsInstalled(true)
                setIsInstallable(false)
            }

            setInstallPrompt(null)
        } catch (error) {
            console.error('[PWA] Installation failed:', error)
        }
    }

    return {
        installPrompt,
        isInstallable,
        isInstalled,
        install
    }
}

