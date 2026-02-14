import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { setUserName } from '../constants/ui';

/**
 * Welcome Modal - Appears on first app load to collect user's name
 * Can be re-opened from Settings later
 */
export const WelcomeModal: React.FC = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Show modal only if no name is configured
        const hasConfiguredName = localStorage.getItem('userName');
        if (!hasConfiguredName) {
            // Delay to let app load first
            setTimeout(() => setShow(true), 800);
        }
    }, []);

    const handleSave = () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('Please enter your name');
            return;
        }
        if (trimmedName.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        if (trimmedName.length > 20) {
            setError('Name must be less than 20 characters');
            return;
        }

        setUserName(trimmedName);
        setShow(false);
    };

    const handleSkip = () => {
        // Set default name so modal doesn't show again
        setUserName('User');
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

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="glass-container"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 500,
                            width: 'min(90vw, 420px)',
                            padding: '32px 24px',
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
                            aria-label="Skip setup"
                        >
                            <X size={18} />
                        </button>

                        {/* Content */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
                                Welcome to <span style={{ color: 'var(--accent)' }}>LifeHub</span>! 👋
                            </h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                                Let's personalize your experience
                            </p>
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
                                What's your name?
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
                                placeholder="Enter your name"
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
                                Skip
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
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </>
            ) : null}
        </AnimatePresence>
    );
};
