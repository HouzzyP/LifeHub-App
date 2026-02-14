import { useState } from 'react'
import { Download, ChevronDown, ChevronUp } from 'lucide-react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'

/**
 * Simple install guide - shows how to add to home screen
 * Works on any Android browser
 */
export function SmartInstallGuide() {
    const device = useDeviceDetection()
    const [isExpanded, setIsExpanded] = useState(false)

    // Check if it's a mobile device and not already installed as app
    const isMobile = device.platform === 'android' || device.platform === 'ios'
    const isAlreadyInstalled = device.isStandalone

    if (!isMobile || isAlreadyInstalled) return null

    const instructions = device.platform === 'ios' 
        ? [
            'Abre Safari',
            'Dirígete a esta página',
            'Toca el botón Compartir (↗)',
            'Selecciona "Agregar a pantalla de inicio"'
          ]
        : [
            'Toca los 3 puntos (⋮) arriba a la derecha',
            'Selecciona "Agregar a la pantalla principal"',
            '¡Listo! LifeHub aparecerá en tu pantalla de inicio'
          ]

    return (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-in fade-in slide-in-from-bottom-2">
            {/* Header - Always Visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-400/30"
            >
                <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Agregar a pantalla de inicio</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                )}
            </button>

            {/* Expanded Content - Only steps, no button confusion */}
            {isExpanded && (
                <div className="mt-2 p-4 bg-slate-900 rounded-lg border border-blue-400/20 shadow-lg space-y-3">
                    <div className="space-y-2">
                        {instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-3">
                                <span className="text-blue-400 font-bold flex-shrink-0 w-6">{idx + 1}.</span>
                                <p className="text-sm text-slate-300">{step}</p>
                            </div>
                        ))}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="w-full px-3 py-2 text-slate-300 hover:text-white text-sm transition-colors"
                    >
                        ← Cerrar
                    </button>
                </div>
            )}
        </div>
    )
}
