import { useState, useEffect } from 'react'

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'other'
export type PlatformType = 'ios' | 'android' | 'windows' | 'macos' | 'linux'

interface InstallDetection {
    browser: BrowserType
    platform: PlatformType
    isStandalone: boolean
    isPWACapable: boolean
}

/**
 * Detect browser and provide platform-specific install instructions
 */
export function useInstallDetection(): InstallDetection {
    const [detection, setDetection] = useState<InstallDetection>({
        browser: 'other',
        platform: 'windows',
        isStandalone: false,
        isPWACapable: false
    })

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase()

        // Detect browser
        let browser: BrowserType = 'other'
        if (ua.indexOf('edg') > -1) browser = 'edge'
        else if (ua.indexOf('chrome') > -1 && ua.indexOf('edg') === -1) browser = 'chrome'
        else if (ua.indexOf('firefox') > -1) browser = 'firefox'
        else if (ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1) browser = 'safari'

        // Detect platform
        let platform: PlatformType = 'windows'
        if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) platform = 'ios'
        else if (ua.indexOf('android') > -1) platform = 'android'
        else if (ua.indexOf('mac') > -1) platform = 'macos'
        else if (ua.indexOf('linux') > -1) platform = 'linux'

        // Check if running as standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches

        // PWA capable browsers
        const isPWACapable = 'serviceWorker' in navigator && 'caches' in window

        setDetection({
            browser,
            platform,
            isStandalone,
            isPWACapable
        })
    }, [])

    return detection
}

/**
 * Get platform-specific install instructions
 */
export function getInstallInstructions(detection: InstallDetection): {
    title: string
    steps: string[]
    emoji: string
} | null {
    const { browser, platform, isStandalone } = detection

    // Already installed
    if (isStandalone) return null

    // iOS - Safari only
    if (platform === 'ios' && browser === 'safari') {
        return {
            emoji: '🍎',
            title: 'Instalar en iPhone/iPad',
            steps: [
                'Presiona el botón Compartir (↗️) abajo a la derecha',
                'Busca y toca "Agregar a pantalla de inicio"',
                'Elige el nombre y toca "Agregar"',
                '¡Listo! La app aparecerá en tu home screen'
            ]
        }
    }

    // iOS - Chrome/Firefox (fallback)
    if (platform === 'ios' && (browser === 'chrome' || browser === 'firefox')) {
        return {
            emoji: '🍎',
            title: 'Instalar en iPhone/iPad',
            steps: [
                'Abre Safari (la app oficial de Apple)',
                'Ve a cualquier sitio web',
                'Presiona Compartir (↗️) y toca "Agregar a pantalla de inicio"',
                'Después abre LifeHub en Safari y repite'
            ]
        }
    }

    // Android - Chrome/Edge
    if (platform === 'android' && (browser === 'chrome' || browser === 'edge')) {
        return {
            emoji: '🤖',
            title: 'Instalar en Android',
            steps: [
                'Verás un banner o presiona el menú ⋮ (arriba a la derecha)',
                'Toca "Instalar app" o "Agregar a pantalla de inicio"',
                '¡Listo! La app aparecerá como aplicación nativa',
                'Se actualizará automáticamente sin ir a Play Store'
            ]
        }
    }

    // Android - Firefox
    if (platform === 'android' && browser === 'firefox') {
        return {
            emoji: '🤖',
            title: 'Instalar en Android',
            steps: [
                'Presiona el menú ⋮ (tres líneas) arriba a la derecha',
                'Busca "Agregar a pantalla de inicio"',
                '¡Listo! La app estará en tu home screen'
            ]
        }
    }

    // Desktop - Windows/Linux/Mac
    if (platform === 'windows' || platform === 'linux' || platform === 'macos') {
        return {
            emoji: '💻',
            title: 'Instalar en tu computadora',
            steps: [
                browser === 'firefox'
                    ? 'Presiona el menú ≡ (arriba a la derecha) → "Instalar aplicación"'
                    : 'Presiona el icono de descarga (⬇️) o menú ⋮ → "Instalar LifeHub"',
                'Confirma la instalación',
                'La app aparecerá en tu escritorio/menú de inicio',
                'Se abrirá sin barra de direcciones (como app nativa)'
            ]
        }
    }

    return null
}
