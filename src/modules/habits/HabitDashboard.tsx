import React, { useState, useEffect, useCallback } from 'react';
import { db, type Habit } from '../../db/db';
import { Plus, CheckCircle2, Circle, Trash2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hoisted constants — rendering-hoist-jsx
const ICON_OPTIONS = ['✨', '💧', '🥗', '📖', '💪', '🧘', '🏃', '🎯', '💤', '🧠'];
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Compute consecutive streak from completedDays
const computeStreak = (completedDays: string[]): number => {
    if (completedDays.length === 0) return 0;

    const sorted = [...completedDays].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Streak must include today or yesterday to be "active"
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

// Get ISO dates for the current week (Mon–Sun)
const getWeekDates = (): string[] => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() + mondayOffset + i);
        return d.toISOString().split('T')[0];
    });
};

export const HabitDashboard: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitIcon, setNewHabitIcon] = useState('✨');

    const loadHabits = useCallback(async () => {
        const allHabits = await db.habits.toArray();
        setHabits(allHabits);
    }, []);

    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    const addHabit = useCallback(async () => {
        if (!newHabitName) return;
        await db.habits.add({
            name: newHabitName,
            icon: newHabitIcon,
            completedDays: [],
            createdAt: Date.now()
        });
        setNewHabitName('');
        setNewHabitIcon('✨');
        setShowAddModal(false);
        await loadHabits();
    }, [newHabitName, newHabitIcon, loadHabits]);

    const toggleHabit = useCallback(async (habit: Habit) => {
        const today = new Date().toISOString().split('T')[0];
        const isCompleted = habit.completedDays.includes(today);

        const newCompletedDays = isCompleted
            ? habit.completedDays.filter(d => d !== today)
            : [...habit.completedDays, today];

        await db.habits.update(habit.id!, { completedDays: newCompletedDays });
        await loadHabits();
    }, [loadHabits]);

    const deleteHabit = useCallback(async (id: number) => {
        await db.habits.delete(id);
        await loadHabits();
    }, [loadHabits]);

    const today = new Date().toISOString().split('T')[0];
    const weekDates = getWeekDates();
    const completedToday = habits.filter(h => h.completedDays.includes(today)).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    return (
        <div style={{ padding: '20px' }}>
            {/* Header with summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Habits</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                        {totalHabits > 0
                            ? `${completedToday}/${totalHabits} completed today`
                            : 'No habits yet'
                        }
                    </p>
                </div>
                <motion.button
                    onClick={() => setShowAddModal(true)}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--bg-primary)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
                    }}
                >
                    <Plus size={24} />
                </motion.button>
            </div>

            {/* Today's progress bar */}
            {totalHabits > 0 ? (
                <div className="glass-container" style={{ padding: '16px 20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Today's Progress</span>
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
            ) : null}

            {/* Habit cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {habits.map((habit, index) => {
                    const isDoneToday = habit.completedDays.includes(today);
                    const streak = computeStreak(habit.completedDays);

                    return (
                        <motion.div
                            key={habit.id}
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
                                    onClick={() => toggleHabit(habit)}
                                    whileTap={{ scale: 0.85 }}
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
                                        justifyContent: 'center'
                                    }}
                                >
                                    {isDoneToday ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                </motion.button>
                                <motion.button
                                    onClick={() => deleteHabit(habit.id!)}
                                    whileTap={{ scale: 0.85 }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        opacity: 0.4,
                                        cursor: 'pointer',
                                        padding: '4px',
                                        transition: 'opacity 0.2s'
                                    }}
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
                })}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal ? (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="glass-container"
                            style={{ position: 'relative', width: '100%', maxWidth: '500px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: '32px' }}
                        >
                            <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>New Habit</h3>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Icon</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {ICON_OPTIONS.map(emoji => (
                                        <motion.button
                                            key={emoji}
                                            onClick={() => setNewHabitIcon(emoji)}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                fontSize: '24px',
                                                padding: '8px',
                                                borderRadius: '12px',
                                                background: newHabitIcon === emoji ? 'var(--accent)' : 'var(--bg-glass)',
                                                border: newHabitIcon === emoji ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Habit Name</label>
                                <input
                                    autoFocus
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' ? addHabit() : null}
                                    placeholder="e.g. Read 10 pages"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '16px',
                                        color: 'white',
                                        fontSize: '16px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <motion.button
                                onClick={addHabit}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: 'var(--bg-primary)',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Create Habit
                            </motion.button>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};
