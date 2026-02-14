import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, Plus, CheckCircle2, Circle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Routine, type WorkoutSet } from '../../../db/db';

interface GymSessionViewProps {
    routine: Routine;
    getExerciseName: (id: number) => string;
    getExerciseCategory: (id: number) => string;
    onBack: () => void;
    onSaveSession: (sessionData: Record<number, { sets: WorkoutSet[] }>) => void;
}

const createInitialSessionData = (routine: Routine): Record<number, { sets: WorkoutSet[] }> => {
    const initial: Record<number, { sets: WorkoutSet[] }> = {};
    for (const ex of routine.exercises) {
        const baseSet: WorkoutSet = {
            weight: ex.targetWeight ?? 0,
            reps: ex.targetReps ?? 0,
            completed: false
        };
        const count = ex.targetSets && ex.targetSets > 1 ? ex.targetSets : 1;
        initial[ex.exerciseId] = {
            sets: Array.from({ length: count }, () => ({ ...baseSet, completed: false }))
        };
    }
    return initial;
};

export const GymSessionView: React.FC<GymSessionViewProps> = ({
    routine,
    getExerciseName,
    getExerciseCategory,
    onBack,
    onSaveSession
}) => {
    const [sessionData, setSessionData] = useState<Record<number, { sets: WorkoutSet[] }>>({});

    useEffect(() => {
        setSessionData(createInitialSessionData(routine));
    }, [routine]);

    const updateSetField = useCallback((exerciseId: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
        setSessionData(prev => {
            const existing = prev[exerciseId]?.sets ?? [];
            const updated = existing.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
            );
            return { ...prev, [exerciseId]: { sets: updated } };
        });
    }, []);

    const toggleSetCompleted = useCallback((exerciseId: number, setIndex: number) => {
        setSessionData(prev => {
            const existing = prev[exerciseId]?.sets ?? [];
            const updated = existing.map((set, idx) =>
                idx === setIndex ? { ...set, completed: !set.completed } : set
            );
            return { ...prev, [exerciseId]: { sets: updated } };
        });
    }, []);

    const addSet = useCallback((exerciseId: number) => {
        setSessionData(prev => {
            const existing = prev[exerciseId]?.sets ?? [];
            const lastSet = existing.length > 0 ? existing[existing.length - 1] : undefined;
            const nextSet: WorkoutSet = {
                weight: lastSet?.weight ?? 0,
                reps: lastSet?.reps ?? 0,
                completed: false
            };
            return { ...prev, [exerciseId]: { sets: [...existing, nextSet] } };
        });
    }, []);

    const removeSet = useCallback((exerciseId: number, setIndex: number) => {
        setSessionData(prev => {
            const existing = prev[exerciseId]?.sets ?? [];
            if (existing.length <= 1) return prev;
            const updated = existing.filter((_, idx) => idx !== setIndex);
            return { ...prev, [exerciseId]: { sets: updated } };
        });
    }, []);

    const handleSave = useCallback(() => {
        onSaveSession(sessionData);
    }, [onSaveSession, sessionData]);

    return (
        <div style={{ padding: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} />
                </motion.button>
                <h2 style={{ fontSize: '20px' }}>{routine.name}</h2>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '24px' }}>Track sets, weight, reps, and completion.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {routine.exercises.map((routineEx) => (
                    <motion.div
                        key={routineEx.exerciseId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-container"
                        style={{ padding: '20px' }}
                    >
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{getExerciseName(routineEx.exerciseId)}</h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '16px' }}>{getExerciseCategory(routineEx.exerciseId)}</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(sessionData[routineEx.exerciseId]?.sets ?? []).map((set, setIndex) => (
                                <div
                                    key={`${routineEx.exerciseId}-${setIndex}`}
                                    className="glass-container"
                                    style={{ padding: '12px', borderRadius: '16px' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Set {setIndex + 1}</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <motion.button
                                                onClick={() => toggleSetCompleted(routineEx.exerciseId, setIndex)}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    background: set.completed ? 'var(--accent)' : 'transparent',
                                                    border: `1px solid ${set.completed ? 'var(--accent)' : 'var(--glass-border)'}`,
                                                    borderRadius: '10px',
                                                    padding: '6px',
                                                    color: set.completed ? 'var(--bg-primary)' : 'var(--text-dim)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {set.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => removeSet(routineEx.exerciseId, setIndex)}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    background: 'var(--bg-glass)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '10px',
                                                    padding: '6px',
                                                    color: '#f87171',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <X size={14} />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Weight (kg)</label>
                                            <input
                                                type="number"
                                                value={set.weight || ''}
                                                onChange={(e) => updateSetField(routineEx.exerciseId, setIndex, 'weight', Number(e.target.value))}
                                                placeholder="0"
                                                style={{
                                                    width: '100%', padding: '12px', background: 'var(--bg-secondary)',
                                                    border: 'none', borderRadius: '10px', textAlign: 'center',
                                                    color: 'white', fontSize: '16px', fontWeight: 700
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Reps</label>
                                            <input
                                                type="number"
                                                value={set.reps || ''}
                                                onChange={(e) => updateSetField(routineEx.exerciseId, setIndex, 'reps', Number(e.target.value))}
                                                placeholder="0"
                                                style={{
                                                    width: '100%', padding: '12px', background: 'var(--bg-secondary)',
                                                    border: 'none', borderRadius: '10px', textAlign: 'center',
                                                    color: 'white', fontSize: '16px', fontWeight: 700
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => addSet(routineEx.exerciseId)}
                            className="glass-container"
                            style={{
                                marginTop: '12px',
                                padding: '10px',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-dim)' }}>
                                <Plus size={16} /> Add Set
                            </div>
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="premium-button"
                style={{ width: '100%', padding: '16px', marginTop: '24px' }}
            >
                Save Session
            </motion.button>
        </div>
    );
};
