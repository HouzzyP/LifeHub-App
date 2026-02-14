import React, { useState, useEffect, useCallback } from 'react';
import { db, type Habit } from '../../db/db';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { HabitCard } from './components/HabitCard';
import { HabitProgressBar } from './components/HabitProgressBar';
import { AddHabitModal } from './components/AddHabitModal';

export const HabitDashboard: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitIcon, setNewHabitIcon] = useState('✨');

    const loadHabits = useCallback(async () => {
        try {
            const allHabits = await db.habits.toArray();
            setHabits(allHabits);
        } catch (error) {
            console.error('[Habits] Failed to load habits:', error);
        }
    }, []);

    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    const addHabit = useCallback(async () => {
        if (!newHabitName.trim()) return;
        try {
            await db.habits.add({
                name: newHabitName.trim(),
                icon: newHabitIcon,
                completedDays: [],
                createdAt: Date.now()
            });
            setNewHabitName('');
            setNewHabitIcon('✨');
            setShowAddModal(false);
            await loadHabits();
        } catch (error) {
            console.error('[Habits] Failed to add habit:', error);
        }
    }, [newHabitName, newHabitIcon, loadHabits]);

    const toggleHabit = useCallback(async (habit: Habit) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const isCompleted = habit.completedDays.includes(today);

            const newCompletedDays = isCompleted
                ? habit.completedDays.filter(d => d !== today)
                : [...habit.completedDays, today];

            await db.habits.update(habit.id!, { completedDays: newCompletedDays });
            await loadHabits();
        } catch (error) {
            console.error('[Habits] Failed to toggle habit:', error);
        }
    }, [loadHabits]);

    const deleteHabit = useCallback(async (id: number) => {
        try {
            await db.habits.delete(id);
            await loadHabits();
        } catch (error) {
            console.error('[Habits] Failed to delete habit:', error);
        }
    }, [loadHabits]);

    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDays.includes(today)).length;
    const totalHabits = habits.length;

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            {/* Header with summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>
                        <span style={{ color: 'var(--accent)' }}>Habit</span>s
                    </h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                        {totalHabits > 0
                            ? `${completedToday}/${totalHabits} completed today`
                            : 'No habits yet'
                        }
                    </p>
                </div>
                <motion.button
                    onClick={() => setShowAddModal(true)}
                    whileTap={{ scale: 0.95 }}
                    className="premium-button"
                    style={{ padding: '10px 16px', borderRadius: '12px' }}
                >
                    <Plus size={18} />
                </motion.button>
            </div>

            {/* Progress bar */}
            <HabitProgressBar completedToday={completedToday} totalHabits={totalHabits} />

            {/* Habit cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {habits.map((habit, index) => {
                    const isDoneToday = habit.completedDays.includes(today);
                    return (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            index={index}
                            isDoneToday={isDoneToday}
                            onToggle={() => toggleHabit(habit)}
                            onDelete={() => deleteHabit(habit.id!)}
                        />
                    );
                })}
            </div>

            {/* Add Modal */}
            <AddHabitModal
                isOpen={showAddModal}
                habitName={newHabitName}
                habitIcon={newHabitIcon}
                onNameChange={setNewHabitName}
                onIconChange={setNewHabitIcon}
                onClose={() => setShowAddModal(false)}
                onCreate={addHabit}
            />
        </div>
    );
};
