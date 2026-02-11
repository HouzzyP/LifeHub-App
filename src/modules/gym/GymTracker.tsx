import React, { useState, useEffect } from 'react';
import { db, type WorkoutSession, type Exercise } from '../../db/db';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { Play, Plus, Calculator, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GymTracker: React.FC = () => {
    const [view, setView] = useState<'home' | 'active_workout' | 'exercises'>('home');
    const [activeRoutine, setActiveRoutine] = useState<Partial<WorkoutSession> | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const load = async () => {
            const exs = await db.exercises.toArray();
            setExercises(exs);
        };
        load();
    }, []);

    // Timer for active workout
    useEffect(() => {
        let interval: any;
        if (view === 'active_workout') {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [view]);

    const startWorkout = (name: string = 'New Workout') => {
        setActiveRoutine({
            routineName: name,
            date: Date.now(),
            exercises: []
        });
        setView('active_workout');
    };

    const addExerciseToRoutine = (exId: number) => {
        if (!activeRoutine) return;
        const newExercises = [...(activeRoutine.exercises || [])];
        newExercises.push({
            exerciseId: exId,
            sets: [{ reps: 0, weight: 0, completed: false }]
        });
        setActiveRoutine({ ...activeRoutine, exercises: newExercises });
    };

    const updateSet = (exIndex: number, setIndex: number, field: 'reps' | 'weight' | 'completed', value: any) => {
        if (!activeRoutine?.exercises) return;
        const newExercises = [...activeRoutine.exercises];
        const set = newExercises[exIndex].sets[setIndex];
        // @ts-ignore
        set[field] = value;
        setActiveRoutine({ ...activeRoutine, exercises: newExercises });
    };

    const addSet = (exIndex: number) => {
        if (!activeRoutine?.exercises) return;
        const newExercises = [...activeRoutine.exercises];
        const previousSet = newExercises[exIndex].sets[newExercises[exIndex].sets.length - 1];
        newExercises[exIndex].sets.push({
            reps: previousSet?.reps || 0,
            weight: previousSet?.weight || 0,
            completed: false
        });
        setActiveRoutine({ ...activeRoutine, exercises: newExercises });
    };

    const finishWorkout = async () => {
        if (activeRoutine && activeRoutine.exercises && activeRoutine.exercises.length > 0) {
            await db.sessions.add(activeRoutine as WorkoutSession);
        }
        setView('home');
        setActiveRoutine(null);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (view === 'exercises') {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'var(--accent)', marginRight: '10px' }}>Back</button>
                    <h2>Exercises</h2>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <ExerciseLibrary />
                </div>
            </div>
        );
    }

    if (view === 'active_workout') {
        return (
            <div style={{ padding: '20px', paddingBottom: '100px', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{activeRoutine?.routineName}</h2>
                        <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '18px' }}>{formatTime(duration)}</span>
                    </div>
                    <button onClick={finishWorkout} className="premium-button" style={{ fontSize: '14px', padding: '8px 16px' }}>Finish</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activeRoutine?.exercises?.map((routineEx, exIndex) => {
                        const exerciseDef = exercises.find(e => e.id === routineEx.exerciseId);
                        return (
                            <motion.div
                                key={exIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-container"
                                style={{ padding: '20px' }}
                            >
                                <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>{exerciseDef?.name}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '10px', marginBottom: '10px', fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
                                    <span>Set</span>
                                    <span>kg</span>
                                    <span>Reps</span>
                                    <span>✓</span>
                                </div>
                                {routineEx.sets.map((set, setIndex) => (
                                    <div key={setIndex} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                        <span style={{ textAlign: 'center', color: 'var(--text-dim)' }}>{setIndex + 1}</span>
                                        <input
                                            type="number"
                                            value={set.weight || ''}
                                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', Number(e.target.value))}
                                            placeholder="0"
                                            style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'white' }}
                                        />
                                        <input
                                            type="number"
                                            value={set.reps || ''}
                                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', Number(e.target.value))}
                                            placeholder="0"
                                            style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'white' }}
                                        />
                                        <button
                                            onClick={() => updateSet(exIndex, setIndex, 'completed', !set.completed)}
                                            style={{
                                                background: set.completed ? 'var(--accent)' : 'var(--bg-secondary)',
                                                border: 'none', borderRadius: '8px', height: '32px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            {set.completed && <CheckIcon size={16} />}
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addSet(exIndex)}
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'var(--text-dim)', marginTop: '10px', cursor: 'pointer' }}
                                >
                                    + Add Set
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Add Exercise</h3>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {exercises.slice(0, 5).map(ex => (
                            <button
                                key={ex.id}
                                onClick={() => addExerciseToRoutine(ex.id!)}
                                className="glass-container"
                                style={{ padding: '12px 20px', minWidth: '120px', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <span style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>{ex.name}</span>
                                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-dim)' }}>{ex.category}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => {/* Open full picker - simplified for now */ }}
                            className="glass-container"
                            style={{ padding: '12px', minWidth: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Home View
    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>Gym<span style={{ color: 'var(--accent)' }}>Tracker</span></h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => startWorkout()}
                    className="premium-button"
                    style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                >
                    <Play size={32} fill="currentColor" />
                    <span>Start Empty Workout</span>
                </button>
                <button
                    onClick={() => setView('exercises')}
                    className="glass-container"
                    style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}
                >
                    <Calculator size={32} color="var(--accent)" />
                    <span>Exercise Library</span>
                </button>
            </div>

            <h3 style={{ marginBottom: '16px', color: 'var(--text-dim)' }}>Recent Routines</h3>
            <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-dim)' }}>No recent workouts. Start training!</p>
            </div>
        </div>
    );
};

// Helper Icon
const CheckIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
