import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStrings } from '../../../constants/ui';
import { useLocale } from '../../../hooks/useLocale';

const ICON_OPTIONS = ['✨', '💧', '🥗', '📖', '💪', '🧘', '🏃', '🎯', '💤', '🧠'];

interface AddHabitModalProps {
    isOpen: boolean;
    habitName: string;
    habitIcon: string;
    onNameChange: (name: string) => void;
    onIconChange: (icon: string) => void;
    onClose: () => void;
    onCreate: () => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
    isOpen,
    habitName,
    habitIcon,
    onNameChange,
    onIconChange,
    onClose,
    onCreate
}) => {
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]);
    // Handle Escape key to close modal
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen ? (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-hidden="true"
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="habit-modal-title"
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="glass-container"
                        style={{ position: 'relative', width: '100%', maxWidth: '500px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: '32px' }}
                    >
                        <h3 id="habit-modal-title" style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 600, color: 'var(--text-main)' }}>{strings.habitsModal.title}</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--accent)', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>{strings.habitsModal.iconLabel}</label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} role="group" aria-label={strings.habitsModal.iconGroupLabel}>
                                {ICON_OPTIONS.map(emoji => (
                                    <motion.button
                                        key={emoji}
                                        onClick={() => onIconChange(emoji)}
                                        whileTap={{ scale: 0.9 }}
                                        aria-pressed={habitIcon === emoji}
                                        aria-label={strings.habitsModal.iconButtonLabel(emoji)}
                                        title={strings.habitsModal.iconButtonLabel(emoji)}
                                        style={{
                                            fontSize: '24px',
                                            padding: '8px',
                                            borderRadius: '12px',
                                            background: habitIcon === emoji ? 'var(--accent)' : 'var(--bg-glass)',
                                            border: habitIcon === emoji ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            minHeight: '44px',
                                            minWidth: '44px'
                                        }}
                                    >
                                        {emoji}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label htmlFor="habit-name" style={{ fontSize: '14px', color: 'var(--accent)', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>{strings.habitsModal.habitNameLabel}</label>
                            <input
                                id="habit-name"
                                autoFocus
                                value={habitName}
                                onChange={(e) => onNameChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' ? onCreate() : null}
                                placeholder={strings.habitsModal.habitNamePlaceholder}
                                aria-label={strings.habitsModal.habitNameLabel}
                                aria-required="true"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    color: 'var(--text-main)',
                                    fontSize: '16px',
                                    outline: 'none',
                                    minHeight: '44px'
                                }}
                            />
                        </div>

                        <motion.button
                            onClick={onCreate}
                            whileTap={{ scale: 0.98 }}
                            className="premium-button"
                            aria-label={strings.habitsModal.createButtonAria}
                            style={{ width: '100%', padding: '16px', minHeight: '44px' }}
                        >
                            {strings.habitsModal.createButton}
                        </motion.button>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
};
