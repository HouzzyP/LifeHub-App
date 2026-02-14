import React from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface GymRoutineDetailEditProps {
    detailName: string;
    detailDay: string;
    exerciseRows: Array<{ exerciseId: number; name: string; category: string; targetSets?: number; targetReps?: number; targetWeight?: number }>;
    showAddExercise: boolean;
    exerciseSearch: string;
    filteredAvailableExercises: Array<{ id?: number; name: string; category: string }>;
    onNameChange: (value: string) => void;
    onDayChange: (value: string) => void;
    onMoveExercise: (from: number, to: number) => void;
    onRemoveExercise: (exerciseId: number) => void;
    onUpdateTarget: (exerciseId: number, field: 'targetSets' | 'targetReps' | 'targetWeight', value: string) => void;
    onToggleAddExercise: () => void;
    onSearchChange: (value: string) => void;
    onAddExercise: (exerciseId: number) => void;
    onSave: () => void;
    onCancel: () => void;
}

export const GymRoutineDetailEdit: React.FC<GymRoutineDetailEditProps> = ({
    detailName,
    detailDay,
    exerciseRows,
    showAddExercise,
    exerciseSearch,
    filteredAvailableExercises,
    onNameChange,
    onDayChange,
    onMoveExercise,
    onRemoveExercise,
    onUpdateTarget,
    onToggleAddExercise,
    onSearchChange,
    onAddExercise,
    onSave,
    onCancel
}) => {
    return (
        <div>
            <div className="glass-container" style={{ padding: '16px 18px', marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'var(--accent)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Routine name</label>
                <input
                    value={detailName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Routine name"
                    style={{
                        width: '100%', padding: '12px', background: 'var(--bg-glass)',
                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                        color: 'var(--text-main)', fontSize: '14px', marginBottom: '12px', fontWeight: 500
                    }}
                />
                <label style={{ fontSize: '12px', color: 'var(--accent)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Optional day label</label>
                <input
                    value={detailDay}
                    onChange={(e) => onDayChange(e.target.value)}
                    placeholder="Optional label (e.g. Monday, Day 1)"
                    style={{
                        width: '100%', padding: '12px', background: 'var(--bg-glass)',
                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                        color: 'var(--text-main)', fontSize: '14px', fontWeight: 500
                    }}
                />
            </div>

            <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Exercises</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exerciseRows.map((exercise, index) => (
                    <div key={exercise.exerciseId} className="glass-container" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '15px', marginBottom: '4px', fontWeight: 600, color: 'var(--text-main)' }}>{exercise.name}</h4>
                                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>{exercise.category}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <motion.button
                                    onClick={() => onMoveExercise(index, index - 1)}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '10px',
                                        padding: '6px',
                                        color: 'var(--text-dim)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <ChevronUp size={14} />
                                </motion.button>
                                <motion.button
                                    onClick={() => onMoveExercise(index, index + 1)}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '10px',
                                        padding: '6px',
                                        color: 'var(--text-dim)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <ChevronDown size={14} />
                                </motion.button>
                                <motion.button
                                    onClick={() => onRemoveExercise(exercise.exerciseId)}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'rgba(248, 113, 113, 0.1)',
                                        border: '1px solid #f87171',
                                        borderRadius: '10px',
                                        padding: '6px',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(248, 113, 113, 0.2)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)')}
                                >
                                    <X size={14} />
                                </motion.button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            <div>
                                <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Sets</label>
                                <input
                                    type="number"
                                    value={exercise.targetSets ?? ''}
                                    onChange={(e) => onUpdateTarget(exercise.exerciseId, 'targetSets', e.target.value)}
                                    placeholder="-"
                                    style={{
                                        width: '100%', padding: '10px', background: 'var(--bg-secondary)',
                                        border: 'none', borderRadius: '10px', textAlign: 'center',
                                        color: 'white', fontSize: '14px', fontWeight: 600
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Reps</label>
                                <input
                                    type="number"
                                    value={exercise.targetReps ?? ''}
                                    onChange={(e) => onUpdateTarget(exercise.exerciseId, 'targetReps', e.target.value)}
                                    placeholder="-"
                                    style={{
                                        width: '100%', padding: '10px', background: 'var(--bg-secondary)',
                                        border: 'none', borderRadius: '10px', textAlign: 'center',
                                        color: 'white', fontSize: '14px', fontWeight: 600
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Weight</label>
                                <input
                                    type="number"
                                    value={exercise.targetWeight ?? ''}
                                    onChange={(e) => onUpdateTarget(exercise.exerciseId, 'targetWeight', e.target.value)}
                                    placeholder="kg"
                                    style={{
                                        width: '100%', padding: '10px', background: 'var(--bg-secondary)',
                                        border: 'none', borderRadius: '10px', textAlign: 'center',
                                        color: 'white', fontSize: '14px', fontWeight: 600
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {exerciseRows.length === 0 ? (
                    <div className="glass-container" style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-dim)' }}>No exercises in this routine yet.</p>
                    </div>
                ) : null}
            </div>

            <div style={{ marginTop: '16px' }}>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onToggleAddExercise}
                    className="premium-button-secondary"
                    style={{ padding: '12px', borderRadius: '14px', cursor: 'pointer', width: '100%', fontSize: '15px', fontWeight: 600 }}
                >
                    {showAddExercise ? '✕ Hide Exercise Library' : '+ Add Exercise'}
                </motion.button>
            </div>

            {showAddExercise ? (
                <div className="glass-container" style={{ padding: '16px', marginTop: '12px' }}>
                    <input
                        value={exerciseSearch}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search exercises..."
                        style={{
                            width: '100%', padding: '12px', background: 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)', borderRadius: '12px',
                            color: 'white', fontSize: '14px', marginBottom: '12px'
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                        {filteredAvailableExercises.map(ex => (
                            <motion.button
                                key={ex.id}
                                onClick={() => onAddExercise(ex.id!)}
                                whileTap={{ scale: 0.97 }}
                                className="glass-container"
                                style={{
                                    padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)', e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)', e.currentTarget.style.background = '')}
                            >
                                <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>{ex.name}</span>
                                <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>{ex.category}</span>
                            </motion.button>
                        ))}
                        {filteredAvailableExercises.length === 0 ? (
                            <p style={{ color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center' }}>No exercises found.</p>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onSave}
                    className="premium-button"
                    style={{ padding: '14px' }}
                >
                    Save Changes
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onCancel}
                    className="glass-container"
                    style={{ padding: '14px', borderRadius: '16px', cursor: 'pointer' }}
                >
                    Cancel
                </motion.button>
            </div>
        </div>
    );
};
