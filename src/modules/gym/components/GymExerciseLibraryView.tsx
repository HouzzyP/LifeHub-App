import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExerciseLibrary } from './ExerciseLibrary';

interface GymExerciseLibraryViewProps {
    onBack: () => void;
}

export const GymExerciseLibraryView: React.FC<GymExerciseLibraryViewProps> = ({ onBack }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} />
                </motion.button>
                <h2 style={{ fontSize: '20px' }}>Exercise Library</h2>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <ExerciseLibrary />
            </div>
        </div>
    );
};
