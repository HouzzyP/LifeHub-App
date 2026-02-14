import React from 'react';
import { CheckCircle2, Circle, Trash2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Habit } from '../../../db/db';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const computeStreak = (completedDays: string[]): number => {
    if (completedDays.length === 0) return 0;

    const sorted = [...completedDays].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const current = new Date(sorted[i - 1]);
        const prev = new Date(sorted[i]);
        const diffMs = current.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / 86400000);
        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

const getWeekDates = (): string[] => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() + mondayOffset + i);
        return d.toISOString().split('T')[0];
    });
};

interface HabitCardProps {
    habit: Habit;
    index: number;
    isDoneToday: boolean;
    onToggle: () => void;
    onDelete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, index, isDoneToday, onToggle, onDelete }) => {
    const today = new Date().toISOString().split('T')[0];
    const weekDates = getWeekDates();
    const streak = computeStreak(habit.completedDays);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-container"
            style={{ padding: '18px 20px', overflow: 'hidden' }}
        >
            {/* Top row: icon + name + streak + toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '26px', lineHeight: 1 }}>{habit.icon}</div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        marginBottom: '2px',
                        color: isDoneToday ? 'var(--accent)' : 'var(--text-main)'
                    }}>
                        {habit.name}
                    </h3>
                    {streak > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Flame size={13} style={{ color: '#f97316' }} />
                            <span style={{ fontSize: '12px', color: '#f97316', fontWeight: 600 }}>
                                {streak} day{streak > 1 ? 's' : ''}
                            </span>
                        </div>
                    ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                            No active streak
                        </span>
                    )}
                </div>
                <motion.button
                    onClick={onToggle}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`${isDoneToday ? 'Mark incomplete' : 'Mark complete'}: ${habit.name}`}
                    aria-pressed={isDoneToday}
                    title={isDoneToday ? 'Mark as incomplete' : 'Mark as complete'}
                    style={{
                        background: isDoneToday ? 'var(--accent)' : 'transparent',
                        border: `2px solid ${isDoneToday ? 'var(--accent)' : 'var(--glass-border)'}`,
                        color: isDoneToday ? 'var(--bg-primary)' : 'var(--text-dim)',
                        padding: '8px',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '44px',
                        minWidth: '44px'
                    }}
                >
                    {isDoneToday ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </motion.button>
                <motion.button
                    onClick={onDelete}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`Delete habit: ${habit.name}`}
                    title="Delete habit"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        opacity: 0.4,
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'opacity 0.2s',
                        minHeight: '44px',
                        minWidth: '44px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
                >
                    <Trash2 size={18} />
                </motion.button>
            </div>

            {/* Weekly dots (Mon–Sun) */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 4px',
                borderTop: '1px solid var(--glass-border)'
            }}>
                {weekDates.map((date, i) => {
                    const isCompleted = habit.completedDays.includes(date);
                    const isToday = date === today;
                    return (
                        <div
                            key={date}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span style={{
                                fontSize: '10px',
                                fontWeight: isToday ? 700 : 400,
                                color: isToday ? 'var(--accent)' : 'var(--text-dim)'
                            }}>
                                {DAY_LABELS[i]}
                            </span>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: isCompleted
                                    ? 'var(--accent)'
                                    : isToday
                                        ? 'rgba(56, 189, 248, 0.2)'
                                        : 'var(--glass-border)',
                                border: isToday ? '1.5px solid var(--accent)' : 'none',
                                transition: 'all 0.2s ease',
                                boxShadow: isCompleted ? '0 0 6px rgba(56, 189, 248, 0.4)' : 'none'
                            }} />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};
