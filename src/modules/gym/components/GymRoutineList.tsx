import React, { useMemo } from 'react';
import { Dumbbell, History, Play, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Routine } from '../../../db/db';

interface GymRoutineListProps {
    routines: Routine[];
    onOpenRoutine: (routine: Routine) => void;
    onStartSession: (routine: Routine) => void;
    onDeleteRoutine: (id: number) => void;
    onOpenHistory: () => void;
    onOpenLibrary: () => void;
    onCreateRoutine: () => void;
    getExerciseName: (id: number) => string;
}

const buildExercisePreview = (routine: Routine, getExerciseName: (id: number) => string): string => {
    const names = routine.exercises.map(ex => getExerciseName(ex.exerciseId));
    if (names.length === 0) return 'No exercises yet';
    if (names.length <= 3) return names.join(', ');
    return `${names.slice(0, 3).join(', ')} +${names.length - 3} more`;
};

export const GymRoutineList: React.FC<GymRoutineListProps> = ({
    routines,
    onOpenRoutine,
    onStartSession,
    onDeleteRoutine,
    onOpenHistory,
    onOpenLibrary,
    onCreateRoutine,
    getExerciseName
}) => {
    const routinePreviews = useMemo(() => {
        return routines.map(routine => ({
            routine,
            preview: buildExercisePreview(routine, getExerciseName)
        }));
    }, [routines, getExerciseName]);

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>
                    Gym<span style={{ color: 'var(--accent)' }}>Tracker</span>
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                        onClick={onOpenHistory}
                        whileTap={{ scale: 0.95 }}
                        className="glass-container"
                        style={{ padding: '10px', cursor: 'pointer', borderRadius: '12px' }}
                    >
                        <History size={20} />
                    </motion.button>
                    <motion.button
                        onClick={onOpenLibrary}
                        whileTap={{ scale: 0.95 }}
                        className="glass-container"
                        style={{ padding: '10px', cursor: 'pointer', borderRadius: '12px' }}
                    >
                        <Dumbbell size={20} />
                    </motion.button>
                    <motion.button
                        onClick={onCreateRoutine}
                        whileTap={{ scale: 0.95 }}
                        className="premium-button"
                        style={{ padding: '10px', borderRadius: '12px' }}
                    >
                        <Plus size={20} />
                    </motion.button>
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
                    {routinePreviews.map(({ routine, preview }) => (
                        <motion.div
                            key={routine.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-container"
                            style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
                        >
                            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onOpenRoutine(routine)}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{routine.name}</h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                                    {routine.dayOfWeek ? `${routine.dayOfWeek} · ` : ''}{routine.exercises.length} exercises
                                </p>
                                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                                    {preview}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <motion.button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onStartSession(routine);
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Play size={16} />
                                </motion.button>
                                <motion.button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDeleteRoutine(routine.id!);
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        color: '#f87171',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
