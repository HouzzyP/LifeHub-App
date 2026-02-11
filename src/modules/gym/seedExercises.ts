import { db } from '../../db/db';

export const DEFAULT_EXERCISES = [
    { name: 'Bench Press', category: 'Chest' },
    { name: 'Incline Dumbbell Press', category: 'Chest' },
    { name: 'Push Ups', category: 'Chest' },
    { name: 'Pull Ups', category: 'Back' },
    { name: 'Lat Pulldown', category: 'Back' },
    { name: 'Barbell Row', category: 'Back' },
    { name: 'Squat', category: 'Legs' },
    { name: 'Leg Press', category: 'Legs' },
    { name: 'Lunges', category: 'Legs' },
    { name: 'Shoulder Press', category: 'Shoulders' },
    { name: 'Lateral Raises', category: 'Shoulders' },
    { name: 'Bicep Curls', category: 'Arms' },
    { name: 'Tricep Extensions', category: 'Arms' },
    { name: 'Plank', category: 'Core' },
    { name: 'Crunches', category: 'Core' },
];

export const seedExercises = async () => {
    const count = await db.exercises.count();
    if (count === 0) {
        await db.exercises.bulkAdd(
            DEFAULT_EXERCISES.map(ex => ({ ...ex, isCustom: false }))
        );
    }
};
