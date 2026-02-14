import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Routine } from '../../../db/db';

interface GymRoutineDetailViewProps {
    routine: Routine;
    exerciseRows: Array<{ exerciseId: number; name: string; category: string; targetSets?: number; targetReps?: number; targetWeight?: number }>;
    onStartSession: (routine: Routine) => void;
}

const formatTargets = (exercise: Routine['exercises'][number]): string => {
    const parts: string[] = [];
    if (exercise.targetSets !== undefined && exercise.targetReps !== undefined) {
        parts.push(`${exercise.targetSets}x${exercise.targetReps}`);
    } else if (exercise.targetSets !== undefined) {
        parts.push(`${exercise.targetSets} sets`);
    } else if (exercise.targetReps !== undefined) {
        parts.push(`${exercise.targetReps} reps`);
    }

    if (exercise.targetWeight !== undefined) {
        parts.push(`${exercise.targetWeight} kg`);
    }

    return parts.length > 0 ? parts.join(' · ') : 'No targets';
};

export const GymRoutineDetailView: React.FC<GymRoutineDetailViewProps> = ({ routine, exerciseRows, onStartSession }) => {
    return (
        <div>
            <div className="glass-container" style={{ padding: '16px 18px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Routine name</p>
                <h3 style={{ fontSize: '18px', marginTop: '6px' }}>{routine.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '10px' }}>Day label</p>
                <p style={{ fontSize: '14px', marginTop: '4px' }}>{routine.dayOfWeek ? routine.dayOfWeek : 'No label'}</p>
            </div>

            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Exercises</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {exerciseRows.map(exercise => (
                    <div key={exercise.exerciseId} className="glass-container" style={{ padding: '14px 16px' }}>
                        <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>{exercise.name}</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{exercise.category}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>{formatTargets(exercise)}</p>
                    </div>
                ))}
                {exerciseRows.length === 0 ? (
                    <div className="glass-container" style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-dim)' }}>No exercises in this routine yet.</p>
                    </div>
                ) : null}
            </div>

            <div style={{ marginTop: '20px' }}>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onStartSession(routine)}
                    className="premium-button"
                    style={{ width: '100%', padding: '14px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Play size={16} /> Start Session
                    </div>
                </motion.button>
            </div>
        </div>
    );
};
