import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, type Habit, type Routine, type WorkoutSession } from '../../db/db';
import { CheckCircle2, Circle, Dumbbell, ChevronRight, Wallet, Droplets, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGreeting, getStrings, getUserName } from '../../constants/ui';
import { useLocale } from '../../hooks/useLocale';

interface DashboardProps {
    onNavigate: (module: string) => void;
}

// Progress Ring SVG component
const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({
    progress,
    size = 72,
    strokeWidth = 5
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="var(--glass-border)" strokeWidth={strokeWidth}
            />
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="var(--accent)" strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
            <text
                x={size / 2} y={size / 2}
                textAnchor="middle" dominantBaseline="central"
                fill="var(--text-main)" fontSize="16" fontWeight="700"
                style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
            >
                {Math.round(progress)}%
            </text>
        </svg>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [lastSession, setLastSession] = useState<WorkoutSession | undefined>();

    const loadData = useCallback(async () => {
        const [h, r, s] = await Promise.all([
            db.habits.toArray(),
            db.routines.toArray(),
            db.sessions.orderBy('date').reverse().first()
        ]);
        setHabits(h);
        setRoutines(r);
        setLastSession(s);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDays.includes(today)).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    const quickAccessModules = useMemo(() => [
        { id: 'finance', name: strings.moduleNames.finance, icon: <Wallet size={20} />, color: '#34d399' },
        { id: 'water', name: strings.moduleNames.water, icon: <Droplets size={20} />, color: '#60a5fa' },
        { id: 'focus', name: strings.moduleNames.focus, icon: <Timer size={20} />, color: '#f87171' },
    ], [strings]);

    const formatSessionDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return strings.timeLabels.today;
        if (diffDays === 1) return strings.timeLabels.yesterday;
        if (diffDays < 7) return strings.timeLabels.daysAgo(diffDays);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Greeting */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}
            >
                {getGreeting(locale)}, {getUserName()} 👋
            </motion.p>

            {/* Habits Widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-container"
                style={{ padding: '24px', cursor: 'pointer' }}
                onClick={() => onNavigate('habits')}
                whileTap={{ scale: 0.98 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                            {strings.dashboard.todayHabitsTitle}
                        </h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
                            {totalHabits > 0
                                ? strings.dashboard.completed(completedToday, totalHabits)
                                : strings.dashboard.noHabitsToday
                            }
                        </p>
                    </div>
                    {totalHabits > 0 ? (
                        <ProgressRing progress={progress} />
                    ) : (
                        <ChevronRight size={20} style={{ color: 'var(--text-dim)' }} />
                    )}
                </div>

                {/* Habit list (max 4) */}
                {habits.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {habits.slice(0, 4).map(habit => {
                            const isDone = habit.completedDays.includes(today);
                            return (
                                <div
                                    key={habit.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '16px',
                                        background: isDone ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isDone ? 'rgba(56, 189, 248, 0.2)' : 'var(--glass-border)'}`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{habit.icon}</span>
                                    <span style={{
                                        flex: 1,
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: isDone ? 'var(--accent)' : 'var(--text-main)',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        opacity: isDone ? 0.7 : 1
                                    }}>
                                        {habit.name}
                                    </span>
                                    {isDone ? (
                                        <CheckCircle2 size={18} style={{ color: 'var(--accent)' }} />
                                    ) : (
                                        <Circle size={18} style={{ color: 'var(--text-dim)' }} />
                                    )}
                                </div>
                            );
                        })}
                        {habits.length > 4 ? (
                            <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
                                {strings.dashboard.moreHabits(habits.length - 4)}
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </motion.div>

            {/* Gym Widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-container"
                style={{ padding: '24px', cursor: 'pointer' }}
                onClick={() => onNavigate('gym')}
                whileTap={{ scale: 0.98 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                            {strings.dashboard.gymTitle}
                        </h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
                            {routines.length > 0
                                ? strings.dashboard.routinesCreated(routines.length)
                                : strings.dashboard.noRoutines
                            }
                        </p>
                    </div>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #818cf8, #1e293b)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Dumbbell size={22} />
                    </div>
                </div>

                {lastSession ? (
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        background: 'rgba(129, 140, 248, 0.08)',
                        border: '1px solid rgba(129, 140, 248, 0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 600 }}>
                                    {lastSession.routineName}
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                                    {formatSessionDate(lastSession.date)} · {lastSession.exercises.length} {strings.dashboard.exercisesLabel}
                                </p>
                            </div>
                            <ChevronRight size={18} style={{ color: 'var(--text-dim)' }} />
                        </div>
                    </div>
                ) : (
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px dashed var(--glass-border)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                            {strings.dashboard.noWorkouts}
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Quick Access Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <p style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                }}>
                    {strings.dashboard.comingSoonLabel}
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px'
                }}>
                    {quickAccessModules.map(mod => (
                        <motion.div
                            key={mod.id}
                            className="glass-container"
                            style={{
                                padding: '16px 8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: 0.5,
                                cursor: 'default',
                                borderRadius: '20px'
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: `linear-gradient(135deg, ${mod.color}, #1e293b)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {mod.icon}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-dim)' }}>
                                {mod.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
