import React from 'react';
import { type Note } from '../../../db/db';
import { NoteCard } from './NoteCard';

interface NotesPinnedSectionProps {
    pinnedNotes: Note[];
    onEdit: (id: number) => void;
}

export const NotesPinnedSection: React.FC<NotesPinnedSectionProps> = ({ pinnedNotes, onEdit }) => {
    if (pinnedNotes.length === 0) return null;

    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
                📌 Pinned
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {pinnedNotes.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} onEdit={onEdit} />
                ))}
            </div>
        </div>
    );
};
