import React from 'react';
import { motion } from 'framer-motion';

interface HabitProgressBarProps {
    completedToday: number;
    totalHabits: number;
}

export const HabitProgressBar: React.FC<HabitProgressBarProps> = ({ completedToday, totalHabits }) => {
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    if (totalHabits === 0) return null;

    return (
        <div className="glass-container" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 500 }}>Today's Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'var(--glass-border)',
                overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        height: '100%',
                        borderRadius: '3px',
                        background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))'
                    }}
                />
            </div>
        </div>
    );
};
