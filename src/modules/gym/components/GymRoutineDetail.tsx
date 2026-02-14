import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, Edit3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Exercise, type Routine } from '../../../db/db';
import { GymRoutineDetailView } from './GymRoutineDetailView';
import { GymRoutineDetailEdit } from './GymRoutineDetailEdit';

interface GymRoutineDetailProps {
    routine: Routine;
    exercises: Exercise[];
    getExerciseName: (id: number) => string;
    getExerciseCategory: (id: number) => string;
    onBack: () => void;
    onStartSession: (routine: Routine) => void;
    onSave: (updated: Routine) => void;
}

const normalizeNumberInput = (value: string): number | undefined => {
    if (value.trim() === '') return undefined;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return undefined;
    return parsed;
};

export const GymRoutineDetail: React.FC<GymRoutineDetailProps> = ({
    routine,
    exercises,
    getExerciseName,
    getExerciseCategory,
    onBack,
    onStartSession,
    onSave
}) => {
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [detailName, setDetailName] = useState(routine.name);
    const [detailDay, setDetailDay] = useState(routine.dayOfWeek ?? '');
    const [detailExercises, setDetailExercises] = useState<Routine['exercises']>(routine.exercises);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [exerciseSearch, setExerciseSearch] = useState('');

    useEffect(() => {
        setDetailName(routine.name);
        setDetailDay(routine.dayOfWeek ?? '');
        setDetailExercises(routine.exercises);
        setMode('view');
        setShowAddExercise(false);
        setExerciseSearch('');
    }, [routine]);

    const availableExercises = useMemo(() => {
        const existing = new Set(detailExercises.map(ex => ex.exerciseId));
        return exercises.filter(ex => ex.id !== undefined && !existing.has(ex.id));
    }, [detailExercises, exercises]);

    const filteredAvailableExercises = useMemo(() => {
        if (!exerciseSearch.trim()) return availableExercises;
        const search = exerciseSearch.toLowerCase();
        return availableExercises.filter(ex => ex.name.toLowerCase().includes(search));
    }, [availableExercises, exerciseSearch]);

    const exerciseRows = useMemo(() => {
        return detailExercises.map(ex => ({
            ...ex,
            name: getExerciseName(ex.exerciseId),
            category: getExerciseCategory(ex.exerciseId)
        }));
    }, [detailExercises, getExerciseName, getExerciseCategory]);

    const moveDetailExercise = useCallback((from: number, to: number) => {
        setDetailExercises(prev => {
            if (to < 0 || to >= prev.length) return prev;
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });
    }, []);

    const removeDetailExercise = useCallback((exerciseId: number) => {
        setDetailExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseId));
    }, []);

    const updateDetailTarget = useCallback((exerciseId: number, field: 'targetSets' | 'targetReps' | 'targetWeight', value: string) => {
        const normalized = normalizeNumberInput(value);
        setDetailExercises(prev => prev.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, [field]: normalized } : ex
        ));
    }, []);

    const addExerciseToRoutine = useCallback((exerciseId: number) => {
        setDetailExercises(prev => ([...prev, { exerciseId }]));
    }, []);

    const handleSave = useCallback(() => {
        if (!detailName.trim()) return;
        onSave({
            ...routine,
            name: detailName.trim(),
            dayOfWeek: detailDay.trim() ? detailDay.trim() : undefined,
            exercises: detailExercises
        });
    }, [detailName, detailDay, detailExercises, onSave, routine]);

    const handleCancelEdit = useCallback(() => {
        setDetailName(routine.name);
        setDetailDay(routine.dayOfWeek ?? '');
        setDetailExercises(routine.exercises);
        setMode('view');
        setShowAddExercise(false);
        setExerciseSearch('');
    }, [routine]);

    return (
        <div style={{ padding: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} />
                </motion.button>
                <h2 style={{ fontSize: '20px' }}>{routine.name}</h2>
            </div>

            <div className="glass-container" style={{ padding: '12px', marginBottom: '20px', display: 'flex', gap: '8px' }}>
                <motion.button
                    onClick={() => setMode('view')}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        background: mode === 'view' ? 'var(--accent)' : 'transparent',
                        color: mode === 'view' ? 'var(--bg-primary)' : 'var(--text-dim)',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Eye size={14} /> View
                    </div>
                </motion.button>
                <motion.button
                    onClick={() => setMode('edit')}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        background: mode === 'edit' ? 'var(--accent)' : 'transparent',
                        color: mode === 'edit' ? 'var(--bg-primary)' : 'var(--text-dim)',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Edit3 size={14} /> Edit
                    </div>
                </motion.button>
            </div>

            {mode === 'view' ? (
                <GymRoutineDetailView routine={routine} exerciseRows={exerciseRows} onStartSession={onStartSession} />
            ) : (
                <GymRoutineDetailEdit
                    detailName={detailName}
                    detailDay={detailDay}
                    exerciseRows={exerciseRows}
                    showAddExercise={showAddExercise}
                    exerciseSearch={exerciseSearch}
                    filteredAvailableExercises={filteredAvailableExercises}
                    onNameChange={setDetailName}
                    onDayChange={setDetailDay}
                    onMoveExercise={moveDetailExercise}
                    onRemoveExercise={removeDetailExercise}
                    onUpdateTarget={updateDetailTarget}
                    onToggleAddExercise={() => setShowAddExercise(prev => !prev)}
                    onSearchChange={setExerciseSearch}
                    onAddExercise={addExerciseToRoutine}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
};
