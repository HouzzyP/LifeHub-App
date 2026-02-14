import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Exercise, type Routine } from '../../../db/db';
import { GymRoutineTargetsEditor } from './GymRoutineTargetsEditor';

interface GymRoutineFormProps {
    exercises: Exercise[];
    onBack: () => void;
    onSave: (payload: { name: string; dayLabel?: string; exercises: Routine['exercises'] }) => void;
}

const normalizeNumberInput = (value: string): number | undefined => {
    if (value.trim() === '') return undefined;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return undefined;
    return parsed;
};

export const GymRoutineForm: React.FC<GymRoutineFormProps> = ({ exercises, onBack, onSave }) => {
    const [name, setName] = useState('');
    const [dayLabel, setDayLabel] = useState('');
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
    const [targets, setTargets] = useState<Record<number, { sets?: number; reps?: number; weight?: number }>>({});

    const exerciseMap = useMemo(() => {
        return new Map(exercises.filter(ex => ex.id !== undefined).map(ex => [ex.id!, ex]));
    }, [exercises]);

    const groupedExercises = useMemo(() => {
        return exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
            if (!acc[ex.category]) acc[ex.category] = [];
            acc[ex.category].push(ex);
            return acc;
        }, {});
    }, [exercises]);

    const selectedExercises = useMemo(() => {
        return selectedExerciseIds.map(id => exerciseMap.get(id)).filter(Boolean) as Exercise[];
    }, [selectedExerciseIds, exerciseMap]);

    const toggleExerciseSelection = useCallback((id: number) => {
        setSelectedExerciseIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    const moveSelectedExercise = useCallback((from: number, to: number) => {
        setSelectedExerciseIds(prev => {
            if (to < 0 || to >= prev.length) return prev;
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });
    }, []);

    const removeSelectedExercise = useCallback((id: number) => {
        setSelectedExerciseIds(prev => prev.filter(x => x !== id));
        setTargets(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const updateTarget = useCallback((id: number, field: 'sets' | 'reps' | 'weight', value: string) => {
        const normalized = normalizeNumberInput(value);
        setTargets(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: normalized }
        }));
    }, []);

    const handleSave = useCallback(() => {
        if (!name.trim() || selectedExerciseIds.length === 0) return;
        const exercisesPayload: Routine['exercises'] = selectedExerciseIds.map(id => ({
            exerciseId: id,
            targetSets: targets[id]?.sets,
            targetReps: targets[id]?.reps,
            targetWeight: targets[id]?.weight
        }));
        onSave({
            name: name.trim(),
            dayLabel: dayLabel.trim() ? dayLabel.trim() : undefined,
            exercises: exercisesPayload
        });
    }, [name, dayLabel, selectedExerciseIds, targets, onSave]);

    return (
        <div style={{ padding: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} />
                </motion.button>
                <h2 style={{ fontSize: '20px' }}>New Routine</h2>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Routine Name</label>
                <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='e.g. "Back Day", "Pecho", "Solo brazos"'
                    style={{
                        width: '100%', padding: '14px', background: 'var(--bg-glass)',
                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                        color: 'var(--text-main)', fontSize: '16px', fontWeight: 500
                    }}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Optional day label</label>
                <input
                    value={dayLabel}
                    onChange={(e) => setDayLabel(e.target.value)}
                    placeholder='Optional label (e.g. Monday, Day 1)'
                    style={{
                        width: '100%', padding: '12px', background: 'var(--bg-glass)',
                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                        color: 'var(--text-main)', fontSize: '14px', fontWeight: 500
                    }}
                />
            </div>

            {selectedExercises.length > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Selected Exercises</h3>
                    <GymRoutineTargetsEditor
                        exercises={selectedExercises}
                        targets={targets}
                        onMove={moveSelectedExercise}
                        onRemove={removeSelectedExercise}
                        onUpdateTarget={updateTarget}
                    />
                </div>
            ) : null}

            <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Select Exercises</h3>
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
                                        border: isSelected ? '1px solid var(--accent)' : '1px solid rgba(56, 189, 248, 0.2)',
                                        background: isSelected ? 'rgba(56, 189, 248, 0.1)' : undefined,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{ex.name}</span>
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
                    onClick={handleSave}
                    className="premium-button"
                    style={{ width: '100%', padding: '16px', position: 'fixed', bottom: '100px', left: '20px', right: '20px', maxWidth: 'calc(100% - 40px)' }}
                >
                    Create Routine ({selectedExerciseIds.length} exercises)
                </motion.button>
            ) : null}
        </div>
    );
};
