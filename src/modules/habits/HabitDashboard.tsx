import React, { useState, useEffect } from 'react';
import { db, type Habit } from '../../db/db';
import { Plus, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HabitDashboard: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitIcon, setNewHabitIcon] = useState('✨');

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        const allHabits = await db.habits.toArray();
        setHabits(allHabits);
    };

    const addHabit = async () => {
        if (!newHabitName) return;
        await db.habits.add({
            name: newHabitName,
            icon: newHabitIcon,
            completedDays: [],
            createdAt: Date.now()
        });
        setNewHabitName('');
        setShowAddModal(false);
        loadHabits();
    };

    const toggleHabit = async (habit: Habit) => {
        const today = new Date().toISOString().split('T')[0];
        const isCompleted = habit.completedDays.includes(today);

        let newCompletedDays = [...habit.completedDays];
        if (isCompleted) {
            newCompletedDays = newCompletedDays.filter(d => d !== today);
        } else {
            newCompletedDays.push(today);
        }

        await db.habits.update(habit.id, { completedDays: newCompletedDays });
        loadHabits();
    };

    const deleteHabit = async (id: number) => {
        await db.habits.delete(id);
        loadHabits();
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px' }}>Tracking Habits</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="premium-button"
                    style={{ padding: '10px 16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={24} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {habits.map((habit) => {
                    const isDoneToday = habit.completedDays.includes(today);
                    return (
                        <motion.div
                            key={habit.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-container"
                            style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ fontSize: '24px' }}>{habit.icon}</div>
                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{habit.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '12px' }}>
                                        <Calendar size={12} />
                                        <span>Streak: {habit.completedDays.length} days</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => toggleHabit(habit)}
                                    style={{
                                        background: isDoneToday ? 'var(--accent)' : 'transparent',
                                        border: `1px solid ${isDoneToday ? 'var(--accent)' : 'var(--glass-border)'}`,
                                        color: isDoneToday ? 'var(--bg-primary)' : 'var(--text-dim)',
                                        padding: '8px',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {isDoneToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </button>
                                <button
                                    onClick={() => deleteHabit(habit.id!)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.5 }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className="glass-container"
                            style={{ position: 'relative', width: '100%', maxWidth: '500px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: '32px' }}
                        >
                            <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>New Habit</h3>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Icon</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {['✨', '💧', '🥗', '📖', '💪', '🧘'].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setNewHabitIcon(emoji)}
                                            style={{
                                                fontSize: '24px', padding: '8px', borderRadius: '12px',
                                                background: newHabitIcon === emoji ? 'var(--accent)' : 'var(--bg-glass)',
                                                border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Habit Name</label>
                                <input
                                    autoFocus
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    placeholder="e.g. Read 10 pages"
                                    style={{
                                        width: '100%', padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--glass-border)',
                                        borderRadius: '16px', color: 'white', fontSize: '16px'
                                    }}
                                />
                            </div>
                            <button onClick={addHabit} className="premium-button" style={{ width: '100%', padding: '16px' }}>Create Habit</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
