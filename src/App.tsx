import React, { useState, useCallback } from 'react';
import {
    LayoutDashboard,
    Dumbbell,
    CheckCircle2,
    Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/main.css';

import { Dashboard } from './modules/dashboard/Dashboard';
import { HabitDashboard } from './modules/habits/HabitDashboard';
import { GymTracker } from './modules/gym/GymTracker';

// Types for our mini-apps
type AppModule = 'dashboard' | 'gym' | 'habits' | 'notes' | 'finance' | 'water' | 'focus';

function App() {
    const [activeApp, setActiveApp] = useState<AppModule>('dashboard');

    const handleNavigate = useCallback((module: string) => {
        setActiveApp(module as AppModule);
    }, []);

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
                        >
                            <Dashboard onNavigate={handleNavigate} />
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
