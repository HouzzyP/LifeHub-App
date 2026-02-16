import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    LayoutDashboard,
    Dumbbell,
    CheckCircle2,
    MoreHorizontal,
    StickyNote,
    Wallet,
    Droplets,
    Timer,
    Settings as SettingsIcon,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/main.css';
import { getStrings, getUserName, type Strings } from './constants/ui';
import { useLocale } from './hooks/useLocale';

import { Dashboard } from './modules/dashboard/Dashboard';
import { HabitDashboard } from './modules/habits/HabitDashboard';
import { GymTracker } from './modules/gym/GymTracker';
import { NotesDashboard } from './modules/notes/NotesDashboard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SmartInstallGuide } from './components/SmartInstallGuide';
import { WelcomeModal } from './components/WelcomeModal';

// Types for our mini-apps
type AppModule = 'dashboard' | 'gym' | 'habits' | 'notes' | 'finance' | 'water' | 'focus';

const getMoreModules = (strings: Strings): { id: AppModule; name: string; icon: React.ReactNode; color: string; ready: boolean }[] => [
    { id: 'notes', name: strings.moduleNames.notes, icon: <StickyNote size={22} />, color: '#fbbf24', ready: true },
    { id: 'finance', name: strings.moduleNames.finance, icon: <Wallet size={22} />, color: '#34d399', ready: false },
    { id: 'water', name: strings.moduleNames.water, icon: <Droplets size={22} />, color: '#60a5fa', ready: false },
    { id: 'focus', name: strings.moduleNames.focus, icon: <Timer size={22} />, color: '#f87171', ready: false },
    { id: 'notes' as AppModule, name: strings.moduleNames.settings, icon: <SettingsIcon size={22} />, color: '#94a3b8', ready: false },
];

function App() {
    const [activeApp, setActiveApp] = useState<AppModule>('dashboard');
    const [showMore, setShowMore] = useState(false);
    const [userName, setUserNameState] = useState(getUserName());
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]);
    const moreModules = useMemo(() => getMoreModules(strings), [strings]);

    const handleNavigate = useCallback((module: string) => {
        setActiveApp(module as AppModule);
    }, []);

    const handleMoreSelect = useCallback((module: AppModule) => {
        setActiveApp(module);
        setShowMore(false);
    }, []);

    const toggleMore = useCallback(() => {
        setShowMore(prev => !prev);
    }, []);

    const closeMore = useCallback(() => {
        setShowMore(false);
    }, []);

    useEffect(() => {
        const handleUserNameChanged = (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            if (customEvent.detail) {
                setUserNameState(customEvent.detail);
            } else {
                setUserNameState(getUserName());
            }
        };

        window.addEventListener('user-name-changed', handleUserNameChanged);
        return () => window.removeEventListener('user-name-changed', handleUserNameChanged);
    }, []);

    return (
        <div className="app-container">
            {/* Welcome Modal - First time setup */}
            <WelcomeModal />

            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* Header */}
            <header style={{ padding: '40px 24px 20px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}
                >
                    Life<span style={{ color: 'var(--accent)' }}>Hub</span>
                </motion.h1>
                <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>{strings.greetings.welcome}, {userName}</p>
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
                            ) : activeApp === 'notes' ? (
                                <NotesDashboard />
                            ) : (
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                        <button
                                            onClick={() => setActiveApp('dashboard')}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
                                        >
                                            {strings.navLabels.back}
                                        </button>
                                        <h2 style={{ fontSize: '24px', textTransform: 'capitalize' }}>{strings.moduleNames[activeApp] ?? activeApp}</h2>
                                    </div>
                                    <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-dim)' }}>{strings.uiMessages.workInProgress(strings.moduleNames[activeApp] ?? activeApp)}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* More Bottom Sheet */}
            <AnimatePresence>
                {showMore ? (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="more-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMore}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 200
                            }}
                        />
                        {/* Sheet */}
                        <motion.div
                            key="more-sheet"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="glass-container"
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                zIndex: 300,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                padding: '24px 20px 40px'
                            }}
                        >
                            {/* Sheet header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{strings.uiMessages.moreModules}</h3>
                                <motion.button
                                    onClick={closeMore}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        color: 'var(--text-dim)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={18} />
                                </motion.button>
                            </div>

                            {/* Module list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {moreModules.map(mod => (
                                    <motion.button
                                        key={mod.name}
                                        onClick={() => mod.ready ? handleMoreSelect(mod.id) : null}
                                        whileTap={mod.ready ? { scale: 0.98 } : undefined}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            padding: '14px 16px',
                                            borderRadius: '16px',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid var(--glass-border)',
                                            color: mod.ready ? 'var(--text-main)' : 'var(--text-dim)',
                                            opacity: mod.ready ? 1 : 0.5,
                                            cursor: mod.ready ? 'pointer' : 'default',
                                            width: '100%',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${mod.color}, #1e293b)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {mod.icon}
                                        </div>
                                        <span style={{ fontSize: '15px', fontWeight: 500 }}>{mod.name}</span>
                                        {mod.ready ? null : (
                                            <span style={{
                                                marginLeft: 'auto',
                                                fontSize: '11px',
                                                padding: '3px 8px',
                                                borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'var(--text-dim)'
                                            }}>
                                                {strings.uiMessages.comingSoon}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                ) : null}
            </AnimatePresence>

            {/* Smart Install Guide - Positioned above navbar */}
            <SmartInstallGuide />

            {/* Navigation Bar */}
            <nav className="navbar">
                <NavItem active={activeApp === 'dashboard'} onClick={() => setActiveApp('dashboard')} icon={<LayoutDashboard size={24} />} label={strings.navLabels.hub} />
                <NavItem active={activeApp === 'habits'} onClick={() => setActiveApp('habits')} icon={<CheckCircle2 size={24} />} label={strings.navLabels.habits} />
                <NavItem active={activeApp === 'gym'} onClick={() => setActiveApp('gym')} icon={<Dumbbell size={24} />} label={strings.navLabels.gym} />
                <NavItem active={showMore} onClick={toggleMore} icon={<MoreHorizontal size={24} />} label={strings.navLabels.more} />
            </nav>
        </div>
    );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: active ? 'var(--accent)' : 'var(--text-dim)',
                cursor: 'pointer',
                position: 'relative',
                background: 'none',
                border: 'none',
                minHeight: '44px',
                minWidth: '44px',
                padding: 0
            }}
            whileTap={{ scale: 0.9 }}
        >
            {icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
            {active ? (
                <motion.div
                    layoutId="nav-glow"
                    style={{
                        position: 'absolute',
                        bottom: '-6px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: '0 0 10px var(--accent)'
                    }}
                />
            ) : null}
        </motion.button>
    );
}

export default App;
