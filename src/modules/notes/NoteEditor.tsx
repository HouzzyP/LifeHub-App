import React, { useState, useCallback, useEffect, useRef } from 'react';
import { db, type Note } from '../../db/db';
import { syncManager } from '../../db/syncManager';
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
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stateRef = useRef({ title: '', content: '', category: 'Personal', isPinned: false, isFavorite: false, existingNote: null as Note | null });

    // Keep stateRef in sync
    useEffect(() => {
        stateRef.current = { title, content, category, isPinned, isFavorite, existingNote };
    }, [title, content, category, isPinned, isFavorite, existingNote]);

    const loadNote = useCallback(async () => {
        if (!noteId) return;
        try {
            const note = await db.notes.get(noteId);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setCategory(note.category);
                setIsPinned(note.isPinned);
                setIsFavorite(note.isFavorite);
                setExistingNote(note);
            }
        } catch (error) {
            console.error('[Notes] Failed to load note:', error);
        }
    }, [noteId]);

    useEffect(() => {
        loadNote();
    }, [loadNote]);

    // Save function - uses stateRef to avoid circular deps
    const saveNote = useCallback(async () => {
        const { title: currentTitle, content: currentContent, category: currentCategory, isPinned: currentIsPinned, isFavorite: currentIsFavorite, existingNote: currentExistingNote } = stateRef.current;

        if (!currentTitle.trim()) return;

        try {
            setIsSaving(true);
            const noteData: Omit<Note, 'id'> = {
                title: currentTitle.trim(),
                content: currentContent,
                category: currentCategory,
                isPinned: currentIsPinned,
                isFavorite: currentIsFavorite,
                createdAt: currentExistingNote ? currentExistingNote.createdAt : Date.now(),
                updatedAt: Date.now()
            };

            if (currentExistingNote?.id) {
                await db.notes.update(currentExistingNote.id, noteData);
                await syncManager.queueSync('note', 'update', { id: currentExistingNote.id, ...noteData });
            } else {
                const id = await db.notes.add(noteData as Note);
                const saved = await db.notes.get(id);
                if (saved) setExistingNote(saved);
                await syncManager.queueSync('note', 'create', { id, ...noteData });
            }
            console.log('[Notes] Auto-saved successfully');
        } catch (error) {
            console.error('[Notes] Failed to save note:', error);
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Debounced auto-save - no dependencies on saveNote
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
        try {
            if (existingNote?.id) {
                await db.notes.delete(existingNote.id);
                await syncManager.queueSync('note', 'delete', { id: existingNote.id });
                console.log('[Notes] Note deleted successfully');
            }
        } catch (error) {
            console.error('[Notes] Failed to delete note:', error);
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
                    onClick={async () => { await saveNote(); onBack(); }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Save and return to notes"
                    title="Save note and return to notes list"
                    style={{
                        background: 'none', border: 'none',
                        color: 'var(--accent)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '14px', padding: 0,
                        minHeight: '44px',
                        minWidth: '44px'
                    }}
                >
                    <ArrowLeft size={18} />
                    <span>Notes</span>
                </motion.button>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                        onClick={togglePreview}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isPreview ? 'Edit note' : 'Preview note'}
                        aria-pressed={isPreview}
                        title={isPreview ? 'Switch to edit mode' : 'Preview note formatting'}
                        style={{
                            background: isPreview ? 'var(--accent)' : 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '8px',
                            color: isPreview ? 'var(--bg-primary)' : 'var(--text-dim)',
                            cursor: 'pointer',
                            minHeight: '44px',
                            minWidth: '44px'
                        }}
                    >
                        {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                    </motion.button>
                    <motion.button
                        onClick={togglePin}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isPinned ? 'Unpin note' : 'Pin note'}
                        aria-pressed={isPinned}
                        title={isPinned ? 'Remove from pinned' : 'Pin to top of list'}
                        style={{
                            background: isPinned ? 'var(--accent)' : 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '8px',
                            color: isPinned ? 'var(--bg-primary)' : 'var(--text-dim)',
                            cursor: 'pointer',
                            minHeight: '44px',
                            minWidth: '44px'
                        }}
                    >
                        <Pin size={16} />
                    </motion.button>
                    <motion.button
                        onClick={toggleFavorite}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={isFavorite}
                        title={isFavorite ? 'Remove star' : 'Mark as favorite'}
                        style={{
                            background: isFavorite ? '#fbbf24' : 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '8px',
                            color: isFavorite ? 'var(--bg-primary)' : 'var(--text-dim)',
                            cursor: 'pointer',
                            minHeight: '44px',
                            minWidth: '44px'
                        }}
                    >
                        <Star size={16} />
                    </motion.button>
                    {existingNote ? (
                        <motion.button
                            onClick={deleteNote}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Delete note"
                            title="Delete this note permanently"
                            style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '10px', padding: '8px',
                                color: '#ef4444', cursor: 'pointer',
                                minHeight: '44px',
                                minWidth: '44px'
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
                aria-label="Note title"
                aria-required="true"
                required
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    outline: 'none',
                    marginBottom: '16px',
                    fontFamily: 'Outfit, Inter, sans-serif',
                    minHeight: '44px'
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
                    aria-label="Note content"
                    aria-describedby="content-help"
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
            <p style={{ textAlign: 'center', color: isSaving ? 'var(--accent)' : 'var(--text-dim)', fontSize: '12px', marginTop: '16px', fontWeight: isSaving ? 600 : 400 }} role="status" aria-live="polite" aria-atomic="true">
                {isSaving ? '💾 Saving...' : '✓ Auto-saved'}
            </p>
        </div>
    );
};
