import React, { useState, useEffect } from 'react';
import { db, type Exercise } from '../../../db/db';
import { seedExercises } from '../seedExercises';
import { Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export const ExerciseLibrary: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseCategory, setNewExerciseCategory] = useState('Chest');

    useEffect(() => {
        const init = async () => {
            await seedExercises(); // Ensure defaults exist
            loadExercises();
        };
        init();
    }, []);

    const loadExercises = async () => {
        const all = await db.exercises.orderBy('name').toArray();
        setExercises(all);
    };

    const addExercise = async () => {
        if (!newExerciseName) return;
        await db.exercises.add({
            name: newExerciseName,
            category: newExerciseCategory,
            isCustom: true
        });
        setNewExerciseName('');
        setShowAddModal(false);
        loadExercises();
    };

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px' }}>Exercise Library</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="premium-button"
                    style={{ padding: '10px 16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 12px 12px 40px',
                            background: 'var(--bg-glass)', border: '1px solid var(--glass-border)', borderRadius: '12px',
                            color: 'white', fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '6px 12px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap',
                            background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-glass)',
                            color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-dim)',
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredExercises.map(ex => (
                    <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-container"
                        style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{ex.name}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{ex.category}</span>
                        </div>
                        {ex.isCustom && <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Custom</span>}
                    </motion.div>
                ))}
                {filteredExercises.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '20px' }}>No exercises found.</p>
                )}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className="glass-container"
                            style={{ position: 'relative', width: '100%', maxWidth: '500px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: '32px' }}
                        >
                            <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>New Custom Exercise</h3>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Exercise Name</label>
                                <input
                                    autoFocus
                                    value={newExerciseName}
                                    onChange={(e) => setNewExerciseName(e.target.value)}
                                    placeholder="e.g. Diamond Pushups"
                                    style={{
                                        width: '100%', padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--glass-border)',
                                        borderRadius: '16px', color: 'white', fontSize: '16px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Category</label>
                                <select
                                    value={newExerciseCategory}
                                    onChange={(e) => setNewExerciseCategory(e.target.value)}
                                    style={{
                                        width: '100%', padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--glass-border)',
                                        borderRadius: '16px', color: 'white', fontSize: '16px'
                                    }}
                                >
                                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                                        <option key={c} value={c} style={{ background: 'var(--bg-secondary)' }}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={addExercise} className="premium-button" style={{ width: '100%', padding: '16px' }}>Save Exercise</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
