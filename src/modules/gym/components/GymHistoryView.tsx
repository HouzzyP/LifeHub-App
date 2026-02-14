import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { type WorkoutSession } from '../../../db/db';

interface GymHistoryViewProps {
    sessions: WorkoutSession[];
    onBack: () => void;
}

const formatShortDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getSessionVolume = (session: WorkoutSession): number => {
    return session.exercises.reduce((total, ex) => {
        const exerciseVolume = ex.sets.reduce((sum, set) => {
            return set.completed ? sum + set.weight * set.reps : sum;
        }, 0);
        return total + exerciseVolume;
    }, 0);
};

export const GymHistoryView: React.FC<GymHistoryViewProps> = ({ sessions, onBack }) => {
    const totalVolume = sessions.reduce((sum, session) => sum + getSessionVolume(session), 0);

    return (
        <div style={{ padding: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} />
                </motion.button>
                <h2 style={{ fontSize: '20px' }}>History</h2>
            </div>

            <div className="glass-container" style={{ padding: '18px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Total Volume</p>
                        <h3 style={{ fontSize: '22px' }}>{Math.round(totalVolume).toLocaleString()} kg</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Sessions</p>
                        <h3 style={{ fontSize: '22px' }}>{sessions.length}</h3>
                    </div>
                </div>
            </div>

            {sessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sessions.map(session => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-container"
                            style={{ padding: '16px 18px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{session.routineName}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                                        {formatShortDate(session.date)}{session.routineDay ? ` · ${session.routineDay}` : ''}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Volume</p>
                                    <p style={{ fontSize: '14px', fontWeight: 700 }}>{Math.round(getSessionVolume(session)).toLocaleString()} kg</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '10px' }}>
                                {session.exercises.length} exercises logged
                            </p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-dim)' }}>No sessions yet. Start your first workout!</p>
                </div>
            )}
        </div>
    );
};
