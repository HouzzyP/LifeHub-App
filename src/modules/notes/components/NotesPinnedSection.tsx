import React, { useMemo } from 'react';
import { type Note } from '../../../db/db';
import { NoteCard } from './NoteCard';
import { useLocale } from '../../../hooks/useLocale';
import { getStrings } from '../../../constants/ui';

interface NotesPinnedSectionProps {
    pinnedNotes: Note[];
    onEdit: (id: number) => void;
}

export const NotesPinnedSection: React.FC<NotesPinnedSectionProps> = ({ pinnedNotes, onEdit }) => {
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]);

    if (pinnedNotes.length === 0) return null;

    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
                {strings.notesUi.pinnedLabel}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {pinnedNotes.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} onEdit={onEdit} />
                ))}
            </div>
        </div>
    );
};
