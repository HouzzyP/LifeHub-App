import { useState, useEffect } from 'react'
import { X, Download, ChevronRight } from 'lucide-react'
import { useInstallDetection, getInstallInstructions } from '../hooks/useInstallDetection'

/**
 * Intelligent install prompt that works on all platforms/browsers
 * Shows platform-specific instructions
 */
export function SmartInstallPrompt() {
    const detection = useInstallDetection()
    const [showPrompt, setShowPrompt] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    const instructions = getInstallInstructions(detection)
    const shouldShow = !detection.isStandalone && instructions !== null && !dismissed

    // Show after 3 seconds if not dismissed
    useEffect(() => {
        if (shouldShow) {
            const timer = setTimeout(() => setShowPrompt(true), 3000)
            return () => clearTimeout(timer)
        }
    }, [shouldShow])

    if (!shouldShow || !showPrompt) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setDismissed(true)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-cyan-500/20 p-6 space-y-4 animate-in slide-in-from-bottom-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{instructions.emoji}</span>
                        <div>
                            <h2 className="text-lg font-bold text-white">{instructions.title}</h2>
                            <p className="text-xs text-slate-400">Sigue estos pasos</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                    {instructions.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex-shrink-0 text-sm font-semibold">
                                {idx + 1}
                            </div>
                            <p className="text-sm text-slate-300 pt-0.5">{step}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => setDismissed(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/50 mt-6"
                >
                    <Download className="w-4 h-4" />
                    Entendido
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dismiss info */}
                <p className="text-xs text-center text-slate-500">
                    Puedes cerrar este modal en cualquier momento
                </p>
            </div>
        </div>
    )
}
