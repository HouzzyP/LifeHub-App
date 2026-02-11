import React, { useState } from 'react';
import {
    LayoutDashboard,
    Dumbbell,
    CheckCircle2,
    StickyNote,
    Wallet,
    Droplets,
    Timer,
    Settings as SettingsIcon,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/main.css';

import { HabitDashboard } from './modules/habits/HabitDashboard';
import { GymTracker } from './modules/gym/GymTracker';

// Types for our mini-apps
type AppModule = 'dashboard' | 'gym' | 'habits' | 'notes' | 'finance' | 'water' | 'focus';

interface AppConfig {
    id: AppModule;
    name: string;
    icon: React.ReactNode;
    color: string;
}

const apps: AppConfig[] = [
    { id: 'habits', name: 'Habit Tracker', icon: <CheckCircle2 size={24} />, color: '#38bdf8' },
    { id: 'gym', name: 'Gym Tracker', icon: <Dumbbell size={24} />, color: '#818cf8' },
    { id: 'notes', name: 'Notes', icon: <StickyNote size={24} />, color: '#fbbf24' },
    { id: 'finance', name: 'Finance', icon: <Wallet size={24} />, color: '#34d399' },
    { id: 'water', name: 'Water', icon: <Droplets size={24} />, color: '#60a5fa' },
    { id: 'focus', name: 'Focus', icon: <Timer size={24} />, color: '#f87171' },
];

function App() {
    const [activeApp, setActiveApp] = useState<AppModule>('dashboard');

    return (
        <div className="app-container">
            {/* Header */}
            <header style={{ padding: '40px 24px 20px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}
                >
                    Life<span style={{ color: 'var(--accent)' }}>Hub</span>
                </motion.h1>
                <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Welcome back, Juanpi</p>
            </header>

            {/* Main Content Area */}
            <main style={{ paddingBottom: '100px' }}>
                <AnimatePresence mode="wait">
                    {activeApp === 'dashboard' ? (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="app-grid"
                        >
                            {apps.map((app, index) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass-container module-card"
                                    onClick={() => setActiveApp(app.id)}
                                >
                                    <div className="icon-wrapper" style={{ background: `linear-gradient(135deg, ${app.color}, #1e293b)` }}>
                                        {app.icon}
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{app.name}</h3>
                                </motion.div>
                            ))}

                            {/* Custom Add App Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (apps.length + 1) * 0.05 }}
                                className="glass-container module-card"
                                style={{ borderStyle: 'dashed', background: 'transparent' }}
                            >
                                <div className="icon-wrapper" style={{ background: 'var(--bg-glass)', color: 'var(--text-dim)' }}>
                                    <Plus size={24} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-dim)' }}>Add App</h3>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeApp}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {activeApp === 'habits' ? (
                                <HabitDashboard />
                            ) : activeApp === 'gym' ? (
                                <GymTracker />
                            ) : (
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                        <button
                                            onClick={() => setActiveApp('dashboard')}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
                                        >
                                            Back
                                        </button>
                                        <h2 style={{ fontSize: '24px', textTransform: 'capitalize' }}>{activeApp}</h2>
                                    </div>
                                    <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-dim)' }}>Work in progress: {activeApp} module is coming soon.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Navigation Bar */}
            <nav className="navbar">
                <NavItem active={activeApp === 'dashboard'} onClick={() => setActiveApp('dashboard')} icon={<LayoutDashboard size={24} />} label="Hub" />
                <NavItem active={activeApp === 'habits'} onClick={() => setActiveApp('habits')} icon={<CheckCircle2 size={24} />} label="Habits" />
                <NavItem active={activeApp === 'gym'} onClick={() => setActiveApp('gym')} icon={<Dumbbell size={24} />} label="Gym" />
                <NavItem active={false} onClick={() => { }} icon={<SettingsIcon size={24} />} label="Setup" />
            </nav>
        </div>
    );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <motion.div
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: active ? 'var(--accent)' : 'var(--text-dim)',
                cursor: 'pointer'
            }}
            whileTap={{ scale: 0.9 }}
        >
            {icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
            {active && (
                <motion.div
                    layoutId="nav-glow"
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: '0 0 10px var(--accent)'
                    }}
                />
            )}
        </motion.div>
    );
}

export default App;
