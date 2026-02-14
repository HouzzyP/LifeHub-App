import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, type Note } from '../../db/db';
import { NoteEditor } from './NoteEditor';
import { NotesHeader } from './components/NotesHeader';
import { NotesPinnedSection } from './components/NotesPinnedSection';
import { NotesGrid } from './components/NotesGrid';

export const NotesDashboard: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadNotes = useCallback(async () => {
        try {
            const allNotes = await db.notes.orderBy('updatedAt').reverse().toArray();
            setNotes(allNotes);
        } catch (error) {
            console.error('[Notes] Failed to load notes:', error);
        }
    }, []);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleBack = useCallback(async () => {
        setEditingId(null);
        setIsCreating(false);
        await loadNotes();
    }, [loadNotes]);

    const handleCreate = useCallback(() => {
        setIsCreating(true);
    }, []);

    const handleEdit = useCallback((id: number) => {
        setEditingId(id);
    }, []);

    // Filter notes — useMemo for derived state
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
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <NotesHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                onCreateNew={handleCreate}
            />

            <NotesPinnedSection pinnedNotes={pinnedNotes} onEdit={handleEdit} />

            <NotesGrid notes={unpinnedNotes} onEdit={handleEdit} isEmpty={notes.length === 0} />
        </div>
    );
};
