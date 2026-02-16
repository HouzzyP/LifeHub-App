import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getStrings, getLocale, setLocale, setUserName, type Locale } from '../constants/ui';
import { useLocale } from '../hooks/useLocale';

/**
 * Welcome Modal - Appears on first app load to collect user's name
 * Can be re-opened from Settings later
 */
export const WelcomeModal: React.FC = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const locale = useLocale();
    const [localLocale, setLocalLocale] = useState<Locale>(getLocale());
    const strings = getStrings(localLocale);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isTestRun = navigator.webdriver || userAgent.includes('Playwright') || userAgent.includes('HeadlessChrome');
        if (isTestRun) return;

        // Show modal only if no name is configured
        const hasConfiguredName = localStorage.getItem('userName');
        if (!hasConfiguredName) {
            // Delay to let app load first
            const timer = window.setTimeout(() => setShow(true), 800);
            return () => window.clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        setLocalLocale(locale);
    }, [locale]);

    const handleSave = () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError(strings.welcomeModal.errors.required);
            return;
        }
        if (trimmedName.length < 2) {
            setError(strings.welcomeModal.errors.min);
            return;
        }
        if (trimmedName.length > 20) {
            setError(strings.welcomeModal.errors.max);
            return;
        }

        setUserName(trimmedName);
        setShow(false);
    };

    const handleSkip = () => {
        // Set default name so modal doesn't show again
        setUserName(strings.welcomeModal.defaultName);
        setShow(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <AnimatePresence>
            {show ? (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 400,
                        }}
                        onClick={handleSkip}
                    />

                    {/* Modal Wrapper */}
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px',
                            zIndex: 500,
                        }}
                        onClick={handleSkip}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="glass-container"
                            style={{
                                width: 'min(92vw, 420px)',
                                maxHeight: 'calc(100vh - 32px)',
                                overflowY: 'auto',
                                padding: '28px 20px',
                                position: 'relative',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={handleSkip}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    padding: '6px',
                                    color: 'var(--text-dim)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                aria-label={strings.welcomeModal.buttons.skip}
                            >
                                <X size={18} />
                            </button>

                            {/* Content */}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
                                    {strings.welcomeModal.title} <span style={{ color: 'var(--accent)' }}>LifeHub</span>! 👋
                                </h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                                    {strings.welcomeModal.subtitle}
                                </p>
                            </div>

                            {/* Language selector */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: 'var(--text-main)',
                                    }}
                                >
                                    {strings.welcomeModal.languageLabel}
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {(['en', 'es'] as Locale[]).map(option => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setLocalLocale(option);
                                                setLocale(option);
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '10px 12px',
                                                borderRadius: '10px',
                                                border: '1px solid var(--glass-border)',
                                                background: option === localLocale
                                                    ? 'rgba(56, 189, 248, 0.15)'
                                                    : 'rgba(255,255,255,0.05)',
                                                color: option === localLocale
                                                    ? 'var(--accent)'
                                                    : 'var(--text-dim)',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                            }}
                                            type="button"
                                        >
                                            {strings.welcomeModal.languageOptions[option]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label
                                    htmlFor="user-name"
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: 'var(--text-main)',
                                    }}
                                >
                                    {strings.welcomeModal.nameLabel}
                                </label>
                                <input
                                    id="user-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError('');
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder={strings.welcomeModal.namePlaceholder}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        fontSize: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${error ? '#f87171' : 'var(--glass-border)'}`,
                                        borderRadius: '12px',
                                        color: 'var(--text-main)',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                    }}
                                />
                                {error ? (
                                    <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
                                        {error}
                                    </p>
                                ) : null}
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleSkip}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-dim)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {strings.welcomeModal.buttons.skip}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="premium-button"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                    }}
                                >
                                    {strings.welcomeModal.buttons.continue}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
};
