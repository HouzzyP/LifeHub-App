import React from 'react';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const FILTER_CATEGORIES = ['All', 'Personal', 'Work', 'Ideas', 'Health', 'Finance'];

interface NotesHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    onCreateNew: () => void;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({
    searchQuery,
    onSearchChange,
    activeCategory,
    onCategoryChange,
    onCreateNew
}) => {
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>
                    <span style={{ color: 'var(--accent)' }}>Note</span>s
                </h2>
                <motion.button
                    onClick={onCreateNew}
                    whileTap={{ scale: 0.95 }}
                    className="premium-button"
                    style={{ padding: '10px 16px', borderRadius: '12px' }}
                >
                    <Plus size={18} />
                </motion.button>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{
                        position: 'absolute', left: '12px', top: '12px',
                        color: 'var(--text-dim)', pointerEvents: 'none'
                    }} />
                    <input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search notes..."
                        style={{
                            width: '100%',
                            paddingLeft: '40px',
                            padding: '10px 14px',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-main)',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Category filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {FILTER_CATEGORIES.map(cat => (
                    <motion.button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
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
        </div>
    );
};
