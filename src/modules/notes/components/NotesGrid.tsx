import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Note } from '../../../db/db';
import { NoteCard } from './NoteCard';
import { useLocale } from '../../../hooks/useLocale';
import { getStrings } from '../../../constants/ui';

interface NotesGridProps {
    notes: Note[];
    onEdit: (id: number) => void;
    isEmpty: boolean;
}

export const NotesGrid: React.FC<NotesGridProps> = ({ notes, onEdit, isEmpty }) => {
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]);

    return (
        <div>
            <h3 style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
                {strings.notesUi.allNotesLabel}
            </h3>
            <AnimatePresence>
                {notes.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}
                    >
                        {notes.map((note, i) => (
                            <NoteCard key={note.id} note={note} index={i} onEdit={onEdit} />
                        ))}
                    </motion.div>
                ) : isEmpty ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="glass-container"
                        style={{ padding: '40px', textAlign: 'center' }}
                    >
                        <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0 }}>
                            {strings.notesUi.noNotes}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="glass-container"
                        style={{ padding: '40px', textAlign: 'center' }}
                    >
                        <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0 }}>
                            {strings.notesUi.noSearchResults}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
