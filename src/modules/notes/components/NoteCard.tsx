import React, { useMemo } from 'react';
import { Pin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Note } from '../../../db/db';
import { useLocale } from '../../../hooks/useLocale';
import { getStrings } from '../../../constants/ui';

const timeAgo = (timestamp: number, strings: ReturnType<typeof getStrings>): string => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return strings.notesUi.timeAgo.justNow;
    if (mins < 60) return strings.notesUi.timeAgo.minutes(mins);
    const hours = Math.floor(mins / 60);
    if (hours < 24) return strings.notesUi.timeAgo.hours(hours);
    const days = Math.floor(hours / 24);
    if (days < 7) return strings.notesUi.timeAgo.days(days);
    return new Date(timestamp).toLocaleDateString();
};

interface NoteCardProps {
    note: Note;
    index: number;
    onEdit: (id: number) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEdit }) => {
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]);
    const preview = note.content.slice(0, 80).replace(/[#*`\-]/g, '');
    const categoryMeta = strings.notesUi.categoryDefaults[note.category] ?? { label: note.category, color: 'var(--text-dim)' };
    const catColor = categoryMeta.color || 'var(--text-dim)';

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
                <h3 style={{ fontSize: '16px', fontWeight: 600, flex: 1, marginRight: '10px', color: 'var(--text-main)' }}>
                    {note.title || strings.notesUi.untitled}
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
                    {categoryMeta.label || note.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {timeAgo(note.updatedAt, strings)}
                </span>
            </div>
        </motion.div>
    );
};
