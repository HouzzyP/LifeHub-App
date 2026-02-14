import React from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Exercise } from '../../../db/db';

interface GymRoutineTargetsEditorProps {
    exercises: Exercise[];
    targets: Record<number, { sets?: number; reps?: number; weight?: number }>;
    onMove: (from: number, to: number) => void;
    onRemove: (id: number) => void;
    onUpdateTarget: (id: number, field: 'sets' | 'reps' | 'weight', value: string) => void;
}

export const GymRoutineTargetsEditor: React.FC<GymRoutineTargetsEditorProps> = ({
    exercises,
    targets,
    onMove,
    onRemove,
    onUpdateTarget
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {exercises.map((ex, index) => (
                <div
                    key={ex.id}
                    className="glass-container"
                    style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>{ex.name}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <motion.button
                                onClick={() => onMove(index, index - 1)}
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
                                onClick={() => onMove(index, index + 1)}
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
                                onClick={() => onRemove(ex.id!)}
                                whileTap={{ scale: 0.95 }}
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        <div>
                            <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Sets</label>
                            <input
                                type="number"
                                value={targets[ex.id!]?.sets ?? ''}
                                onChange={(e) => onUpdateTarget(ex.id!, 'sets', e.target.value)}
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
                                value={targets[ex.id!]?.reps ?? ''}
                                onChange={(e) => onUpdateTarget(ex.id!, 'reps', e.target.value)}
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
                                value={targets[ex.id!]?.weight ?? ''}
                                onChange={(e) => onUpdateTarget(ex.id!, 'weight', e.target.value)}
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
        </div>
    );
};
