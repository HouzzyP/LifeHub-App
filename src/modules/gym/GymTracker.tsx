import React, { useState, useEffect, useCallback } from 'react';
import { db, type Routine, type Exercise } from '../../db/db';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { seedExercises } from './seedExercises';
import { Plus, ChevronLeft, Trash2, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GymView = 'routines' | 'create_routine' | 'routine_detail' | 'exercises' | 'session';

export const GymTracker: React.FC = () => {
    const [view, setView] = useState<GymView>('routines');
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

    // Create routine state
    const [newRoutineName, setNewRoutineName] = useState('');
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);

    // Session state (when training)
    const [sessionData, setSessionData] = useState<Record<number, { weight: number; reps: number }>>({});

    const loadData = useCallback(async () => {
        await seedExercises();
        const [allRoutines, allExercises] = await Promise.all([
            db.routines.toArray(),
            db.exercises.orderBy('name').toArray()
        ]);
        setRoutines(allRoutines);
        setExercises(allExercises);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const getExerciseName = useCallback((id: number) => {
        return exercises.find(e => e.id === id)?.name ?? 'Unknown';
    }, [exercises]);

    const getExerciseCategory = useCallback((id: number) => {
        return exercises.find(e => e.id === id)?.category ?? '';
    }, [exercises]);

    // --- Create Routine ---
    const toggleExerciseSelection = (id: number) => {
        setSelectedExerciseIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const saveRoutine = async () => {
        if (!newRoutineName.trim() || selectedExerciseIds.length === 0) return;
        await db.routines.add({
            name: newRoutineName.trim(),
            exercises: selectedExerciseIds.map(id => ({ exerciseId: id }))
        });
        setNewRoutineName('');
        setSelectedExerciseIds([]);
        await loadData();
        setView('routines');
    };

    const deleteRoutine = async (id: number) => {
        await db.routines.delete(id);
        await loadData();
        if (selectedRoutine?.id === id) {
            setSelectedRoutine(null);
            setView('routines');
        }
    };

    // --- Session ---
    const startSession = (routine: Routine) => {
        setSelectedRoutine(routine);
        const initial: Record<number, { weight: number; reps: number }> = {};
        for (const ex of routine.exercises) {
            initial[ex.exerciseId] = {
                weight: ex.targetWeight ?? 0,
                reps: ex.targetReps ?? 0,
            };
        }
        setSessionData(initial);
        setView('session');
    };

    const updateSessionField = (exId: number, field: 'weight' | 'reps', value: number) => {
        setSessionData(prev => ({
            ...prev,
            [exId]: { ...prev[exId], [field]: value }
        }));
    };

    const saveSession = async () => {
        if (!selectedRoutine) return;
        // Update target weight/reps on the routine for next time
        const updatedExercises = selectedRoutine.exercises.map(ex => ({
            ...ex,
            targetWeight: sessionData[ex.exerciseId]?.weight ?? ex.targetWeight,
            targetReps: sessionData[ex.exerciseId]?.reps ?? ex.targetReps,
        }));
        await db.routines.update(selectedRoutine.id!, { exercises: updatedExercises });

        // Also save as a session record
        await db.sessions.add({
            routineName: selectedRoutine.name,
            date: Date.now(),
            exercises: selectedRoutine.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                sets: [{
                    weight: sessionData[ex.exerciseId]?.weight ?? 0,
                    reps: sessionData[ex.exerciseId]?.reps ?? 0,
                    completed: true
                }]
            }))
        });

        await loadData();
        setView('routines');
        setSelectedRoutine(null);
    };

    // --- Exercise Library View ---
    if (view === 'exercises') {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setView('routines')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '20px' }}>Exercise Library</h2>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <ExerciseLibrary />
                </div>
            </div>
        );
    }

    // --- Create Routine View ---
    if (view === 'create_routine') {
        const groupedExercises = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
            if (!acc[ex.category]) acc[ex.category] = [];
            acc[ex.category].push(ex);
            return acc;
        }, {});

        return (
            <div style={{ padding: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <button onClick={() => setView('routines')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '20px' }}>New Routine</h2>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Routine Name</label>
                    <input
                        autoFocus
                        value={newRoutineName}
                        onChange={(e) => setNewRoutineName(e.target.value)}
                        placeholder='e.g. "Chest Day", "Push", "Day 1"'
                        style={{
                            width: '100%', padding: '14px', background: 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)', borderRadius: '12px',
                            color: 'white', fontSize: '16px'
                        }}
                    />
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Select Exercises</h3>
                {Object.entries(groupedExercises).map(([category, exs]) => (
                    <div key={category} style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{category}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {exs.map(ex => {
                                const isSelected = selectedExerciseIds.includes(ex.id!);
                                return (
                                    <motion.button
                                        key={ex.id}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => toggleExerciseSelection(ex.id!)}
                                        className="glass-container"
                                        style={{
                                            padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                                            border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                                            background: isSelected ? 'rgba(56, 189, 248, 0.1)' : undefined,
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}
                                    >
                                        <span style={{ fontWeight: 500 }}>{ex.name}</span>
                                        {isSelected ? (
                                            <span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 700 }}>✓</span>
                                        ) : null}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {selectedExerciseIds.length > 0 ? (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={saveRoutine}
                        className="premium-button"
                        style={{ width: '100%', padding: '16px', position: 'fixed', bottom: '100px', left: '20px', right: '20px', maxWidth: 'calc(100% - 40px)' }}
                    >
                        Create Routine ({selectedExerciseIds.length} exercises)
                    </motion.button>
                ) : null}
            </div>
        );
    }

    // --- Session View (Training!) ---
    if (view === 'session' && selectedRoutine) {
        return (
            <div style={{ padding: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <button onClick={() => setView('routines')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '20px' }}>{selectedRoutine.name}</h2>
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '24px' }}>Fill in your weight & reps for today.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedRoutine.exercises.map((routineEx) => (
                        <motion.div
                            key={routineEx.exerciseId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-container"
                            style={{ padding: '20px' }}
                        >
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{getExerciseName(routineEx.exerciseId)}</h3>
                            <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '16px' }}>{getExerciseCategory(routineEx.exerciseId)}</span>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={sessionData[routineEx.exerciseId]?.weight || ''}
                                        onChange={(e) => updateSessionField(routineEx.exerciseId, 'weight', Number(e.target.value))}
                                        placeholder="0"
                                        style={{
                                            width: '100%', padding: '12px', background: 'var(--bg-secondary)',
                                            border: 'none', borderRadius: '10px', textAlign: 'center',
                                            color: 'white', fontSize: '18px', fontWeight: 700
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Reps</label>
                                    <input
                                        type="number"
                                        value={sessionData[routineEx.exerciseId]?.reps || ''}
                                        onChange={(e) => updateSessionField(routineEx.exerciseId, 'reps', Number(e.target.value))}
                                        placeholder="0"
                                        style={{
                                            width: '100%', padding: '12px', background: 'var(--bg-secondary)',
                                            border: 'none', borderRadius: '10px', textAlign: 'center',
                                            color: 'white', fontSize: '18px', fontWeight: 700
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={saveSession}
                    className="premium-button"
                    style={{ width: '100%', padding: '16px', marginTop: '24px' }}
                >
                    Save Session
                </motion.button>
            </div>
        );
    }

    // --- Routines Home ---
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>
                    Gym<span style={{ color: 'var(--accent)' }}>Tracker</span>
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setView('exercises')}
                        className="glass-container"
                        style={{ padding: '10px', cursor: 'pointer', borderRadius: '12px' }}
                    >
                        <Dumbbell size={20} />
                    </button>
                    <button
                        onClick={() => setView('create_routine')}
                        className="premium-button"
                        style={{ padding: '10px', borderRadius: '12px' }}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>My Routines</h3>

            {routines.length === 0 ? (
                <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <Dumbbell size={40} style={{ color: 'var(--text-dim)', marginBottom: '12px' }} />
                    <p style={{ color: 'var(--text-dim)' }}>No routines yet. Create your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {routines.map(routine => (
                        <motion.div
                            key={routine.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-container"
                            style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div onClick={() => startSession(routine)} style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{routine.name}</h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                                    {routine.exercises.length} exercises — {routine.exercises.map(e => getExerciseName(e.exerciseId)).join(', ')}
                                </p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteRoutine(routine.id!); }}
                                style={{ background: 'none', border: 'none', color: 'rgba(248, 113, 113, 0.7)', cursor: 'pointer', padding: '8px' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
