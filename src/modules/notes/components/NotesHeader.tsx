import React, { useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '../../../hooks/useLocale';
import { getStrings } from '../../../constants/ui';

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
    const locale = useLocale();
    const strings = useMemo(() => getStrings(locale), [locale]); // rerender-memo
    const allCategoryValue = strings.notesUi.allCategoryValue;

    // Build filter categories dynamically with "All" prepended
    const filterCategories = useMemo(
        () => [allCategoryValue, ...strings.notesUi.categories],
        [allCategoryValue, strings.notesUi.categories]
    );
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>
                    <span style={{ color: 'var(--accent)' }}>{strings.notesUi.title}</span>
                </h2>
                <motion.button
                    onClick={onCreateNew}
                    whileTap={{ scale: 0.95 }}
                    aria-label={strings.buttonLabels.create}
                    // WCAG 2.2: min 44x44px touch target
                    className="premium-button"
                    style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        minHeight: '44px',
                        minWidth: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
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
                        placeholder={strings.notesUi.searchPlaceholder}
                        aria-label={strings.notesUi.searchPlaceholder}
                        style={{
                            width: '100%',
                            paddingLeft: '40px',
                            padding: '12px 14px',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-main)',
                            fontSize: '14px',
                            outline: 'none',
                            minHeight: '44px', // Touch target
                        }}
                    />
                </div>
            </div>

            {/* Category filters - WCAG 2.2 accessible buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {filterCategories.map(cat => {
                    const displayLabel = cat === allCategoryValue
                        ? strings.notesUi.allCategoryLabel
                        : strings.notesUi.categoryDefaults[cat as keyof typeof strings.notesUi.categoryDefaults]?.label || cat;
                    return (
                    <motion.button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={activeCategory === cat}
                        aria-label={displayLabel}
                        // WCAG 2.2: min 44x44px touch target + focus-visible
                        style={{
                            padding: '8px 14px',
                            background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-glass)',
                            border: activeCategory === cat ? 'none' : '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-main)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            minHeight: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onCategoryChange(cat);
                            }
                        }}
                    >
                        {displayLabel}
                    </motion.button>
                );})}
            </div>
        </div>
    );
};
