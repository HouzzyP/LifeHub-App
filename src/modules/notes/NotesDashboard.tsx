import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, type Note } from '../../db/db';
import { Plus, Search, Pin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoteEditor } from './NoteEditor';

// Hoisted constants — rendering-hoist-jsx
const FILTER_CATEGORIES = ['All', 'Personal', 'Work', 'Ideas', 'Health', 'Finance'];

// Category color map — hoisted
const CATEGORY_COLORS: Record<string, string> = {
    Personal: '#a78bfa',
    Work: '#38bdf8',
    Ideas: '#fbbf24',
    Health: '#34d399',
    Finance: '#f87171'
};

// Format relative time
const timeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
};

export const NotesDashboard: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadNotes = useCallback(async () => {
        const allNotes = await db.notes.orderBy('updatedAt').reverse().toArray();
        setNotes(allNotes);
    }, []);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleBack = useCallback(() => {
        setEditingId(null);
        setIsCreating(false);
        loadNotes();
    }, [loadNotes]);

    const handleCreate = useCallback(() => {
        setIsCreating(true);
    }, []);

    const handleEdit = useCallback((id: number) => {
        setEditingId(id);
    }, []);

    // Filter notes — useMemo for derived state (rerender-derived-state-no-effect)
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesCategory = activeCategory === 'All' ? true : note.category === activeCategory;
            const matchesSearch = searchQuery.trim() === ''
                ? true
                : note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [notes, activeCategory, searchQuery]);

    // Separate pinned and unpinned
    const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
    const unpinnedNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

    // Show editor if creating or editing
    if (isCreating) {
        return <NoteEditor onBack={handleBack} />;
    }
    if (editingId !== null) {
        return <NoteEditor noteId={editingId} onBack={handleBack} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Notes</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                        {notes.length} note{notes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <motion.button
                    onClick={handleCreate}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--bg-primary)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
                    }}
                >
                    <Plus size={24} />
                </motion.button>
            </div>

            {/* Search bar */}
            <div className="glass-container" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                marginBottom: '16px'
            }}>
                <Search size={18} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Category filter chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
                {FILTER_CATEGORIES.map(cat => (
                    <motion.button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-glass)',
                            color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-dim)',
                            border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--glass-border)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            {/* Pinned section */}
            {pinnedNotes.length > 0 ? (
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Pin size={13} /> Pinned
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {pinnedNotes.map((note, i) => (
                            <NoteCard key={note.id} note={note} index={i} onEdit={handleEdit} />
                        ))}
                    </div>
                </div>
            ) : null}

            {/* All notes */}
            <AnimatePresence>
                {unpinnedNotes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {unpinnedNotes.map((note, i) => (
                            <NoteCard key={note.id} note={note} index={i} onEdit={handleEdit} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-container"
                        style={{ padding: '40px', textAlign: 'center' }}
                    >
                        <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
                            {notes.length === 0
                                ? 'No notes yet. Tap + to create one!'
                                : 'No notes match your search.'
                            }
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Extracted sub-component per component-refactoring skill
interface NoteCardProps {
    note: Note;
    index: number;
    onEdit: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEdit }) => {
    const preview = note.content.slice(0, 80).replace(/[#*`\-]/g, '');
    const catColor = CATEGORY_COLORS[note.category] || 'var(--text-dim)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onEdit(note.id!)}
            whileTap={{ scale: 0.98 }}
            className="glass-container"
            style={{ padding: '16px 20px', cursor: 'pointer' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, flex: 1, marginRight: '10px' }}>
                    {note.title || 'Untitled'}
                </h3>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    {note.isFavorite ? <Star size={14} style={{ color: '#fbbf24' }} /> : null}
                    {note.isPinned ? <Pin size={14} style={{ color: 'var(--accent)' }} /> : null}
                </div>
            </div>
            {preview ? (
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '10px', lineHeight: 1.4 }}>
                    {preview}{note.content.length > 80 ? '...' : ''}
                </p>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    background: `${catColor}20`,
                    color: catColor,
                    fontWeight: 600
                }}>
                    {note.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {timeAgo(note.updatedAt)}
                </span>
            </div>
        </motion.div>
    );
};
