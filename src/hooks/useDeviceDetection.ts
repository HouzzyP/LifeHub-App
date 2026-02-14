import { useEffect, useState } from 'react'

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'other'
export type PlatformType = 'ios' | 'android' | 'windows'

export interface DeviceInfo {
    browser: BrowserType
    platform: PlatformType
    isStandalone: boolean
}

export function useDeviceDetection(): DeviceInfo {
    const [device, setDevice] = useState<DeviceInfo>({
        browser: 'chrome',
        platform: 'windows',
        isStandalone: false
    })

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase()

        // Detect browser
        let browser: BrowserType = 'chrome'
        if (ua.includes('edg')) browser = 'edge'
        else if (ua.includes('firefox')) browser = 'firefox'
        else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'safari'
        else if (ua.includes('chrome')) browser = 'chrome'

        // Detect platform
        let platform: PlatformType = 'windows'
        if (ua.includes('iphone') || ua.includes('ipad')) platform = 'ios'
        else if (ua.includes('android')) platform = 'android'
        else if (ua.includes('mac')) platform = 'windows' // For consistency

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches

        setDevice({ browser, platform, isStandalone })
    }, [])

    return device
}

/**
 * Get installation instructions based on device and browser
 */
export function getInstallInstructions(device: DeviceInfo): { steps: string[]; title: string } | null {
    const { browser, platform, isStandalone } = device

    if (isStandalone) return null // Already installed

    // iOS - Safari
    if (platform === 'ios' && browser === 'safari') {
        return {
            title: 'Agregar LifeHub a tu iPhone',
            steps: [
                '1. Presiona el botón Compartir (↗️) arriba a la derecha',
                '2. Busca y presiona "Agregar a pantalla de inicio"',
                '3. Confirma el nombre y presiona "Agregar"',
                '¡Listo! La app está en tu home screen'
            ]
        }
    }

    // iOS - Chrome/Firefox (must use Safari)
    if (platform === 'ios' && (browser === 'chrome' || browser === 'firefox')) {
        return {
            title: 'Instalar LifeHub en iPhone',
            steps: [
                'Chrome/Firefox no soporta PWA en iOS',
                '1. Abre Safari (la app de Apple)',
                '2. Ve a http://lifehub.local',
                '3. Compartir → "Agregar a pantalla de inicio"'
            ]
        }
    }

    // Android - Chrome/Edge (HTTPS required)
    if (platform === 'android' && (browser === 'chrome' || browser === 'edge')) {
        return {
            title: 'Instalar LifeHub en Android',
            steps: [
                '⚠️ Nota: Necesitas HTTPS para instalar',
                '1. Usa ngrok para crear un enlace HTTPS',
                '2. Accede a la app desde Chrome via HTTPS',
                '3. Verás un banner "Instalar LifeHub"',
                '4. Presiona "Instalar" y listo!'
            ]
        }
    }

    // Android - Firefox
    if (platform === 'android' && browser === 'firefox') {
        return {
            title: 'Instalar LifeHub en Android (Firefox)',
            steps: [
                '1. Presiona el menú ⋮ (tres líneas) arriba a la derecha',
                '2. Busca "Instalar en pantalla de inicio"',
                '3. Confirma y ¡listo!'
            ]
        }
    }

    // Desktop fallback
    return {
        title: 'Instalar LifeHub',
        steps: [
            'La instalación está disponible en navegadores Chromium',
            'Usa ngrok para HTTPS: ngrok http 5173',
            'Accede a tu app via HTTPS',
            'Verás el banner de instalación'
        ]
    }
}
