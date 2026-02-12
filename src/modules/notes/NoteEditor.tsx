import React, { useState, useCallback, useEffect, useRef } from 'react';
import { db, type Note } from '../../db/db';
import { ArrowLeft, Pin, Star, Trash2, Eye, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

// Hoisted constants — rendering-hoist-jsx
const CATEGORIES = ['Personal', 'Work', 'Ideas', 'Health', 'Finance'];

interface NoteEditorProps {
    noteId?: number;
    onBack: () => void;
}

// Simple markdown-to-HTML renderer (bold, italic, headers, lists, code)
const renderMarkdown = (text: string): string => {
    return text
        .replace(/^### (.+)$/gm, '<h4 style="margin:8px 0;font-size:15px">$1</h4>')
        .replace(/^## (.+)$/gm, '<h3 style="margin:10px 0;font-size:17px">$1</h3>')
        .replace(/^# (.+)$/gm, '<h2 style="margin:12px 0;font-size:20px">$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
        .replace(/^- (.+)$/gm, '<div style="padding-left:12px">• $1</div>')
        .replace(/\n/g, '<br/>');
};

export const NoteEditor: React.FC<NoteEditorProps> = ({ noteId, onBack }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Personal');
    const [isPinned, setIsPinned] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [existingNote, setExistingNote] = useState<Note | null>(null);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadNote = useCallback(async () => {
        if (!noteId) return;
        const note = await db.notes.get(noteId);
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setCategory(note.category);
            setIsPinned(note.isPinned);
            setIsFavorite(note.isFavorite);
            setExistingNote(note);
        }
    }, [noteId]);

    useEffect(() => {
        loadNote();
    }, [loadNote]);

    const saveNote = useCallback(async () => {
        if (!title.trim()) return;

        const noteData: Omit<Note, 'id'> = {
            title: title.trim(),
            content,
            category,
            isPinned,
            isFavorite,
            createdAt: existingNote ? existingNote.createdAt : Date.now(),
            updatedAt: Date.now()
        };

        if (existingNote?.id) {
            await db.notes.update(existingNote.id, noteData);
        } else {
            const id = await db.notes.add(noteData as Note);
            const saved = await db.notes.get(id);
            if (saved) setExistingNote(saved);
        }
    }, [title, content, category, isPinned, isFavorite, existingNote]);

    // Debounced auto-save
    const triggerAutoSave = useCallback(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            saveNote();
        }, 800);
    }, [saveNote]);

    // Auto-save on content/title changes
    useEffect(() => {
        if (title.trim()) {
            triggerAutoSave();
        }
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [title, content, category, isPinned, isFavorite, triggerAutoSave]);

    const deleteNote = useCallback(async () => {
        if (existingNote?.id) {
            await db.notes.delete(existingNote.id);
        }
        onBack();
    }, [existingNote, onBack]);

    const togglePin = useCallback(() => {
        setIsPinned(prev => !prev);
    }, []);

    const toggleFavorite = useCallback(() => {
        setIsFavorite(prev => !prev);
    }, []);

    const togglePreview = useCallback(() => {
        setIsPreview(prev => !prev);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <motion.button
                    onClick={() => { saveNote(); onBack(); }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        background: 'none', border: 'none',
                        color: 'var(--accent)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '14px', padding: 0
                    }}
                >
                    <ArrowLeft size={18} />
                    <span>Notes</span>
                </motion.button>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                        onClick={togglePreview}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: isPreview ? 'var(--accent)' : 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '8px',
                            color: isPreview ? 'var(--bg-primary)' : 'var(--text-dim)',
                            cursor: 'pointer'
                        }}
                    >
                        {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                    </motion.button>
                    <motion.button
                        onClick={togglePin}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: isPinned ? 'var(--accent)' : 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '8px',
                            color: isPinned ? 'var(--bg-primary)' : 'var(--text-dim)',
                            cursor: 'pointer'
                        }}
                    >
                        <Pin size={16} />
                    </motion.button>
                    <motion.button
                        onClick={toggleFavorite}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: isFavorite ? '#fbbf24' : 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '8px',
                            color: isFavorite ? 'var(--bg-primary)' : 'var(--text-dim)',
                            cursor: 'pointer'
                        }}
                    >
                        <Star size={16} />
                    </motion.button>
                    {existingNote ? (
                        <motion.button
                            onClick={deleteNote}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '10px', padding: '8px',
                                color: '#ef4444', cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={16} />
                        </motion.button>
                    ) : null}
                </div>
            </div>

            {/* Category chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <motion.button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: category === cat ? 'var(--accent)' : 'var(--bg-glass)',
                            color: category === cat ? 'var(--bg-primary)' : 'var(--text-dim)',
                            border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--glass-border)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            {/* Title */}
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Note title..."
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    outline: 'none',
                    marginBottom: '16px',
                    fontFamily: 'Outfit, Inter, sans-serif'
                }}
            />

            {/* Content area */}
            {isPreview ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-container"
                    style={{
                        padding: '20px',
                        minHeight: '300px',
                        lineHeight: 1.7,
                        fontSize: '15px',
                        color: 'var(--text-main)'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '*No content yet...*') }}
                />
            ) : (
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Start writing... (supports **bold**, *italic*, # headers, - lists, `code`)"
                    style={{
                        width: '100%',
                        minHeight: '300px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '20px',
                        color: 'var(--text-main)',
                        fontSize: '15px',
                        lineHeight: 1.7,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'Inter, sans-serif'
                    }}
                />
            )}

            {/* Auto-save indicator */}
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px', marginTop: '16px' }}>
                Auto-saves as you type
            </p>
        </div>
    );
};
