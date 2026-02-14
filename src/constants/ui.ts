/**
 * UI Constants - Centralized text strings and configuration
 * 
 * This file contains all hardcoded strings used throughout the app.
 * Makes it easier to:
 * - Change text without searching through components
 * - Implement i18n/translations in the future
 * - Maintain consistency across the app
 */

// User Configuration
export const USER_CONFIG = {
    name: 'Juanpi', // Change this to personalize the app
};

// Greetings
export const GREETINGS = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    welcome: 'Welcome back',
};

// Time-based greeting function
export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return GREETINGS.morning;
    if (hour < 18) return GREETINGS.afternoon;
    return GREETINGS.evening;
};

// Navigation Labels
export const NAV_LABELS = {
    hub: 'Hub',
    habits: 'Habits',
    gym: 'Gym',
    notes: 'Notes',
    more: 'More',
    back: 'Back',
};

// Module Names
export const MODULE_NAMES = {
    dashboard: 'Dashboard',
    habits: 'Habits',
    gym: 'Gym',
    notes: 'Notes',
    finance: 'Finance',
    water: 'Water',
    focus: 'Focus',
    settings: 'Settings',
};

// UI Messages
export const UI_MESSAGES = {
    moreModules: 'More Modules',
    workInProgress: (moduleName: string) => `Work in progress: ${moduleName} module is coming soon.`,
    comingSoon: 'Soon',
    noHabits: 'No habits yet. Create your first one!',
    noRoutines: 'No routines yet',
    createFirst: 'Create your first routine',
};

// Progress Messages
export const PROGRESS_MESSAGES = {
    todayProgress: "Today's Progress",
    completedToday: (completed: number, total: number) => `${completed}/${total} completed today`,
    noHabitsToday: 'No habits for today',
};

// Time Formatting
export const TIME_LABELS = {
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: (days: number) => `${days} days ago`,
    lastSession: 'Last session',
};

// Button Labels
export const BUTTON_LABELS = {
    create: 'Create',
    createHabit: 'Create Habit',
    createRoutine: 'Create Routine',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    start: 'Start',
    finish: 'Finish',
    install: 'Instalar',
    installApp: 'Instalar LifeHub',
};

// Habit-specific
export const HABIT_UI = {
    streakLabel: (days: number) => `${days} day${days !== 1 ? 's' : ''}`,
    weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
};

// Gym-specific
export const GYM_UI = {
    routines: 'Routines',
    exercises: 'exercises',
    lastWorkout: 'Last workout',
    totalVolume: 'Total volume',
};

// Install Prompt
export const INSTALL_MESSAGES = {
    title: 'Instalar LifeHub',
    fallbackInstructions:
        'Para instalar LifeHub:\n\n' +
        '1. Abre el menú (⋮) arriba a la derecha en Chrome\n' +
        '2. Selecciona "Instalar aplicación" o "Instalar LifeHub"\n' +
        '3. Confirma\n\n' +
        '¡La app aparecerá en tu pantalla de inicio!',
};
