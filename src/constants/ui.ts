/**
 * UI Constants - Centralized text strings and configuration
 *
 * This file contains all user-facing strings used throughout the app.
 * It also provides a lightweight localization system.
 */

export type Locale = 'en' | 'es';

const STORAGE_KEYS = {
    userName: 'userName',
    locale: 'locale',
};

const DEFAULT_LOCALE: Locale = 'en';

export const getLocale = (): Locale => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    const stored = localStorage.getItem(STORAGE_KEYS.locale);
    return stored === 'es' ? 'es' : 'en';
};

export const setLocale = (locale: Locale): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.locale, locale);
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
};

export const getUserName = (): string => {
    if (typeof window === 'undefined') return 'User';
    const storedName = localStorage.getItem(STORAGE_KEYS.userName);
    if (storedName && storedName.trim()) {
        return storedName.trim();
    }
    return getStrings(getLocale()).welcomeModal.defaultName;
};

export const setUserName = (name: string): void => {
    if (typeof window === 'undefined') return;
    const trimmed = name.trim();
    const value = trimmed || getStrings(getLocale()).welcomeModal.defaultName;
    localStorage.setItem(STORAGE_KEYS.userName, value);
    window.dispatchEvent(new CustomEvent('user-name-changed', { detail: value }));
};

export type Strings = {
    greetings: {
        morning: string;
        afternoon: string;
        evening: string;
        welcome: string;
    };
    navLabels: {
        hub: string;
        habits: string;
        gym: string;
        notes: string;
        more: string;
        back: string;
    };
    moduleNames: {
        dashboard: string;
        habits: string;
        gym: string;
        notes: string;
        finance: string;
        water: string;
        focus: string;
        settings: string;
    };
    uiMessages: {
        moreModules: string;
        workInProgress: (moduleName: string) => string;
        comingSoon: string;
        noHabits: string;
        noRoutines: string;
        createFirst: string;
    };
    dashboard: {
        todayHabitsTitle: string;
        completed: (completed: number, total: number) => string;
        noHabitsToday: string;
        exercisesLabel: string;
        noWorkouts: string;
        comingSoonLabel: string;
        gymTitle: string;
        routinesCreated: (count: number) => string;
        noRoutines: string;
        moreHabits: (count: number) => string;
    };
    progressMessages: {
        todayProgress: string;
        completedToday: (completed: number, total: number) => string;
        noHabitsToday: string;
    };
    timeLabels: {
        today: string;
        yesterday: string;
        daysAgo: (days: number) => string;
        lastSession: string;
    };
    buttonLabels: {
        create: string;
        createHabit: string;
        createRoutine: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        start: string;
        finish: string;
        install: string;
        installApp: string;
    };
    habitUi: {
        streakLabel: (days: number) => string;
        weekDays: string[];
    };
    gymUi: {
        routines: string;
        exercises: string;
        lastWorkout: string;
        totalVolume: string;
    };
    installMessages: {
        title: string;
        fallbackInstructions: string;
    };
    habitsModal: {
        title: string;
        iconLabel: string;
        iconGroupLabel: string;
        iconButtonLabel: (emoji: string) => string;
        habitNameLabel: string;
        habitNamePlaceholder: string;
        createButton: string;
        createButtonAria: string;
    };
    notesUi: {
        title: string;
        allCategoryLabel: string;
        allCategoryValue: string;
        allNotesLabel: string;
        pinnedLabel: string;
        categories: string[];
        categoryDefaults: Record<string, { label: string; color: string }>;
        searchPlaceholder: string;
        noNotes: string;
        noSearchResults: string;
        untitled: string;
        timeAgo: {
            justNow: string;
            minutes: (mins: number) => string;
            hours: (hours: number) => string;
            days: (days: number) => string;
        };
        editor: {
            backToNotes: string;
            saveAndReturn: string;
            preview: string;
            edit: string;
            previewTitle: string;
            editTitle: string;
            pin: string;
            unpin: string;
            pinTitle: string;
            unpinTitle: string;
            favorite: string;
            unfavorite: string;
            favoriteTitle: string;
            unfavoriteTitle: string;
            delete: string;
            deleteTitle: string;
            titlePlaceholder: string;
            contentPlaceholder: string;
            emptyContentPreview: string;
            saving: string;
            saved: string;
        };
    };
    statusMessages: {
        offlineTitle: string;
        offlineSubtitle: string;
        syncingAria: string;
        syncingLabel: string;
    };
    welcomeModal: {
        title: string;
        subtitle: string;
        nameLabel: string;
        namePlaceholder: string;
        defaultName: string;
        languageLabel: string;
        languageOptions: {
            en: string;
            es: string;
        };
        buttons: {
            skip: string;
            continue: string;
        };
        errors: {
            required: string;
            min: string;
            max: string;
        };
    };
};

const STRINGS: Record<Locale, Strings> = {
    en: {
        greetings: {
            morning: 'Good morning',
            afternoon: 'Good afternoon',
            evening: 'Good evening',
            welcome: 'Welcome back',
        },
        navLabels: {
            hub: 'Hub',
            habits: 'Habits',
            gym: 'Gym',
            notes: 'Notes',
            more: 'More',
            back: 'Back',
        },
        moduleNames: {
            dashboard: 'Dashboard',
            habits: 'Habits',
            gym: 'Gym',
            notes: 'Notes',
            finance: 'Finance',
            water: 'Water',
            focus: 'Focus',
            settings: 'Settings',
        },
        uiMessages: {
            moreModules: 'More Modules',
            workInProgress: (moduleName: string) => `Work in progress: ${moduleName} module is coming soon.`,
            comingSoon: 'Soon',
            noHabits: 'No habits yet. Create your first one!',
            noRoutines: 'No routines yet',
            createFirst: 'Create your first routine',
        },
        dashboard: {
            todayHabitsTitle: "Today's Habits",
            completed: (completed: number, total: number) => `${completed}/${total} completed`,
            noHabitsToday: 'No habits for today',
            exercisesLabel: 'exercises',
            noWorkouts: 'No workouts logged yet - start one!',
            comingSoonLabel: 'Coming Soon',
            gymTitle: 'Gym Tracker',
            routinesCreated: (count: number) => `${count} routine${count !== 1 ? 's' : ''} created`,
            noRoutines: 'No routines yet - tap to create one!',
            moreHabits: (count: number) => `+${count} more habits`,
        },
        progressMessages: {
            todayProgress: "Today's Progress",
            completedToday: (completed: number, total: number) => `${completed}/${total} completed today`,
            noHabitsToday: 'No habits for today',
        },
        timeLabels: {
            today: 'Today',
            yesterday: 'Yesterday',
            daysAgo: (days: number) => `${days} days ago`,
            lastSession: 'Last session',
        },
        buttonLabels: {
            create: 'Create',
            createHabit: 'Create Habit',
            createRoutine: 'Create Routine',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            start: 'Start',
            finish: 'Finish',
            install: 'Install',
            installApp: 'Install LifeHub',
        },
        habitUi: {
            streakLabel: (days: number) => `${days} day${days !== 1 ? 's' : ''}`,
            weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        },
        gymUi: {
            routines: 'Routines',
            exercises: 'exercises',
            lastWorkout: 'Last workout',
            totalVolume: 'Total volume',
        },
        installMessages: {
            title: 'Install LifeHub',
            fallbackInstructions:
                'To install LifeHub:\n\n' +
                '1. Open the menu (⋮) in the top-right of Chrome\n' +
                '2. Select "Install app" or "Install LifeHub"\n' +
                '3. Confirm\n\n' +
                'The app will appear on your home screen!',
        },
        habitsModal: {
            title: 'New Habit',
            iconLabel: 'Icon',
            iconGroupLabel: 'Select habit icon',
            iconButtonLabel: (emoji: string) => `Select ${emoji} icon`,
            habitNameLabel: 'Habit Name',
            habitNamePlaceholder: 'e.g. Read 10 pages',
            createButton: 'Create Habit',
            createButtonAria: 'Create Habit',
        },
        notesUi: {
            title: 'Notes',
            allCategoryLabel: 'All',
            allCategoryValue: 'All',
            allNotesLabel: 'All Notes',
            pinnedLabel: 'Pinned',
            categories: ['Personal', 'Work', 'Ideas', 'Health', 'Finance'],
            categoryDefaults: {
                Personal: { label: 'Personal', color: '#a78bfa' },
                Work: { label: 'Work', color: '#38bdf8' },
                Ideas: { label: 'Ideas', color: '#fbbf24' },
                Health: { label: 'Health', color: '#34d399' },
                Finance: { label: 'Finance', color: '#f87171' },
            },
            searchPlaceholder: 'Search notes...',
            noNotes: 'No notes yet. Tap + to create one!',
            noSearchResults: 'No notes match your search.',
            untitled: 'Untitled',
            timeAgo: {
                justNow: 'Just now',
                minutes: (mins: number) => `${mins}m ago`,
                hours: (hours: number) => `${hours}h ago`,
                days: (days: number) => `${days}d ago`,
            },
            editor: {
                backToNotes: 'Notes',
                saveAndReturn: 'Save and return to notes',
                preview: 'Preview note',
                edit: 'Edit note',
                previewTitle: 'Preview note formatting',
                editTitle: 'Switch to edit mode',
                pin: 'Pin note',
                unpin: 'Unpin note',
                pinTitle: 'Pin to top of list',
                unpinTitle: 'Remove from pinned',
                favorite: 'Add to favorites',
                unfavorite: 'Remove from favorites',
                favoriteTitle: 'Mark as favorite',
                unfavoriteTitle: 'Remove star',
                delete: 'Delete note',
                deleteTitle: 'Delete this note permanently',
                titlePlaceholder: 'Note title...',
                contentPlaceholder: 'Start writing... (supports **bold**, *italic*, # headers, - lists, `code`)',
                emptyContentPreview: '*No content yet...*',
                saving: 'Saving...',
                saved: 'Auto-saved',
            },
        },
        statusMessages: {
            offlineTitle: "You're offline",
            offlineSubtitle: 'Changes will sync when reconnected',
            syncingAria: 'Syncing changes',
            syncingLabel: 'Syncing...',
        },
        welcomeModal: {
            title: 'Welcome to LifeHub',
            subtitle: "Let's personalize your experience",
            nameLabel: "What's your name?",
            namePlaceholder: 'Enter your name',
            defaultName: 'User',
            languageLabel: 'Language',
            languageOptions: {
                en: 'English',
                es: 'Spanish',
            },
            buttons: {
                skip: 'Skip',
                continue: 'Continue',
            },
            errors: {
                required: 'Please enter your name',
                min: 'Name must be at least 2 characters',
                max: 'Name must be less than 20 characters',
            },
        },
    },
    es: {
        greetings: {
            morning: 'Buenos dias',
            afternoon: 'Buenas tardes',
            evening: 'Buenas noches',
            welcome: 'Bienvenido de vuelta',
        },
        navLabels: {
            hub: 'Inicio',
            habits: 'Habitos',
            gym: 'Gym',
            notes: 'Notas',
            more: 'Mas',
            back: 'Volver',
        },
        moduleNames: {
            dashboard: 'Inicio',
            habits: 'Habitos',
            gym: 'Gym',
            notes: 'Notas',
            finance: 'Finanzas',
            water: 'Agua',
            focus: 'Focus',
            settings: 'Ajustes',
        },
        uiMessages: {
            moreModules: 'Mas modulos',
            workInProgress: (moduleName: string) => `En progreso: el modulo ${moduleName} estara listo pronto.`,
            comingSoon: 'Pronto',
            noHabits: 'No hay habitos aun. Crea el primero!',
            noRoutines: 'No hay rutinas aun',
            createFirst: 'Crea tu primera rutina',
        },
        dashboard: {
            todayHabitsTitle: 'Habitos de hoy',
            completed: (completed: number, total: number) => `${completed}/${total} completados`,
            noHabitsToday: 'No hay habitos para hoy',
            exercisesLabel: 'ejercicios',
            noWorkouts: 'No hay entrenamientos aun - comienza uno!',
            comingSoonLabel: 'Proximamente',
            gymTitle: 'Gym',
            routinesCreated: (count: number) => `${count} rutina${count !== 1 ? 's' : ''} creada${count !== 1 ? 's' : ''}`,
            noRoutines: 'No hay rutinas aun - toca para crear una!',
            moreHabits: (count: number) => `+${count} habitos mas`,
        },
        progressMessages: {
            todayProgress: 'Progreso de hoy',
            completedToday: (completed: number, total: number) => `${completed}/${total} completados hoy`,
            noHabitsToday: 'No hay habitos para hoy',
        },
        timeLabels: {
            today: 'Hoy',
            yesterday: 'Ayer',
            daysAgo: (days: number) => `Hace ${days} dias`,
            lastSession: 'Ultima sesion',
        },
        buttonLabels: {
            create: 'Crear',
            createHabit: 'Crear habito',
            createRoutine: 'Crear rutina',
            save: 'Guardar',
            cancel: 'Cancelar',
            delete: 'Eliminar',
            edit: 'Editar',
            start: 'Iniciar',
            finish: 'Finalizar',
            install: 'Instalar',
            installApp: 'Instalar LifeHub',
        },
        habitUi: {
            streakLabel: (days: number) => `${days} dia${days !== 1 ? 's' : ''}`,
            weekDays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        },
        gymUi: {
            routines: 'Rutinas',
            exercises: 'ejercicios',
            lastWorkout: 'Ultimo entrenamiento',
            totalVolume: 'Volumen total',
        },
        installMessages: {
            title: 'Instalar LifeHub',
            fallbackInstructions:
                'Para instalar LifeHub:\n\n' +
                '1. Abre el menu (⋮) arriba a la derecha en Chrome\n' +
                '2. Selecciona "Instalar aplicacion" o "Instalar LifeHub"\n' +
                '3. Confirma\n\n' +
                'La app aparecera en tu pantalla de inicio!',
        },
        habitsModal: {
            title: 'Nuevo habito',
            iconLabel: 'Icono',
            iconGroupLabel: 'Selecciona un icono',
            iconButtonLabel: (emoji: string) => `Seleccionar icono ${emoji}`,
            habitNameLabel: 'Nombre del habito',
            habitNamePlaceholder: 'ej. Leer 10 paginas',
            createButton: 'Crear habito',
            createButtonAria: 'Crear habito',
        },
        notesUi: {
            title: 'Notas',
            allCategoryLabel: 'Todas',
            allCategoryValue: 'All',
            allNotesLabel: 'Todas las notas',
            pinnedLabel: 'Fijadas',
            categories: ['Personal', 'Work', 'Ideas', 'Health', 'Finance'],
            categoryDefaults: {
                Personal: { label: 'Personal', color: '#a78bfa' },
                Work: { label: 'Trabajo', color: '#38bdf8' },
                Ideas: { label: 'Ideas', color: '#fbbf24' },
                Health: { label: 'Salud', color: '#34d399' },
                Finance: { label: 'Finanzas', color: '#f87171' },
            },
            searchPlaceholder: 'Buscar notas...',
            noNotes: 'No hay notas aun. Toca + para crear una!',
            noSearchResults: 'No hay notas que coincidan con tu busqueda.',
            untitled: 'Sin titulo',
            timeAgo: {
                justNow: 'Ahora mismo',
                minutes: (mins: number) => `Hace ${mins}m`,
                hours: (hours: number) => `Hace ${hours}h`,
                days: (days: number) => `Hace ${days}d`,
            },
            editor: {
                backToNotes: 'Notas',
                saveAndReturn: 'Guardar y volver a notas',
                preview: 'Vista previa',
                edit: 'Editar nota',
                previewTitle: 'Ver formato de la nota',
                editTitle: 'Volver a editar',
                pin: 'Fijar nota',
                unpin: 'Desfijar nota',
                pinTitle: 'Fijar en la parte superior',
                unpinTitle: 'Quitar de fijadas',
                favorite: 'Agregar a favoritos',
                unfavorite: 'Quitar de favoritos',
                favoriteTitle: 'Marcar como favorita',
                unfavoriteTitle: 'Quitar estrella',
                delete: 'Eliminar nota',
                deleteTitle: 'Eliminar esta nota permanentemente',
                titlePlaceholder: 'Titulo de la nota...',
                contentPlaceholder: 'Comienza a escribir... (soporta **negrita**, *italica*, # titulos, - listas, `code`)',
                emptyContentPreview: '*Sin contenido aun...*',
                saving: 'Guardando...',
                saved: 'Guardado automatico',
            },
        },
        statusMessages: {
            offlineTitle: 'Estas sin conexion',
            offlineSubtitle: 'Los cambios se sincronizaran al reconectar',
            syncingAria: 'Sincronizando cambios',
            syncingLabel: 'Sincronizando...',
        },
        welcomeModal: {
            title: 'Bienvenido a LifeHub',
            subtitle: 'Personalicemos tu experiencia',
            nameLabel: 'Como te llamas?',
            namePlaceholder: 'Escribe tu nombre',
            defaultName: 'Usuario',
            languageLabel: 'Idioma',
            languageOptions: {
                en: 'Ingles',
                es: 'Espanol',
            },
            buttons: {
                skip: 'Saltar',
                continue: 'Continuar',
            },
            errors: {
                required: 'Por favor escribe tu nombre',
                min: 'El nombre debe tener al menos 2 caracteres',
                max: 'El nombre debe tener menos de 20 caracteres',
            },
        },
    },
};

export const getStrings = (locale: Locale = getLocale()): Strings => {
    return STRINGS[locale] ?? STRINGS.en;
};

/**
 * Get time-based greeting using local device time
 * Morning: 5:00 - 11:59
 * Afternoon: 12:00 - 17:59
 * Evening: 18:00 - 4:59
 */
export const getGreeting = (locale: Locale = getLocale()): string => {
    const hour = new Date().getHours();
    const { greetings } = getStrings(locale);
    if (hour >= 5 && hour < 12) return greetings.morning;
    if (hour >= 12 && hour < 18) return greetings.afternoon;
    return greetings.evening;
};