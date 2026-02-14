import Dexie, { type Table } from 'dexie';

export interface Habit {
    id?: number;
    name: string;
    icon: string; // Emoji or Lucide icon name
    completedDays: string[]; // ISO dates
    createdAt: number;
}

export interface Exercise {
    id?: number;
    name: string;
    category: string; // Chest, Back, etc.
    isCustom: boolean;
}

export interface WorkoutSet {
    reps: number;
    weight: number;
    completed: boolean;
}

export interface WorkoutSession {
    id?: number;
    routineId?: number;
    routineName: string;
    routineDay?: string;
    date: number;
    exercises: {
        exerciseId: number;
        sets: WorkoutSet[];
    }[];
}

export interface Note {
    id?: number;
    title: string;
    content: string;
    category: string;
    isPinned: boolean;
    isFavorite: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface Routine {
    id?: number;
    name: string;
    dayOfWeek?: string;
    exercises: {
        exerciseId: number;
        targetSets?: number;
        targetReps?: number;
        targetWeight?: number;
    }[];
}

export class LifeHubDB extends Dexie {
    habits!: Table<Habit>;
    exercises!: Table<Exercise>;
    routines!: Table<Routine>;
    sessions!: Table<WorkoutSession>;
    notes!: Table<Note>;

    constructor() {
        super('LifeHubDB');
        this.version(1).stores({
            habits: '++id, name',
            exercises: '++id, name, category',
            sessions: '++id, routineName, date',
            notes: '++id, title, updatedAt'
        });
        this.version(2).stores({
            habits: '++id, name',
            exercises: '++id, name, category',
            sessions: '++id, routineName, date',
            notes: '++id, title, updatedAt',
            routines: '++id, name'
        });
        this.version(3).stores({
            habits: '++id, name',
            exercises: '++id, name, category',
            sessions: '++id, routineName, date',
            routines: '++id, name',
            notes: '++id, title, category, updatedAt, isPinned'
        });
    }
}

export const db = new LifeHubDB();
