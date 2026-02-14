import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, type Routine, type Exercise, type WorkoutSession, type WorkoutSet } from '../../db/db';
import { seedExercises } from './seedExercises';
import { GymExerciseLibraryView } from './components/GymExerciseLibraryView';
import { GymRoutineList } from './components/GymRoutineList';
import { GymRoutineForm } from './components/GymRoutineForm';
import { GymRoutineDetail } from './components/GymRoutineDetail';
import { GymSessionView } from './components/GymSessionView';
import { GymHistoryView } from './components/GymHistoryView';

type GymView = 'routines' | 'create_routine' | 'routine_detail' | 'exercises' | 'session' | 'history';

export const GymTracker: React.FC = () => {
    const [view, setView] = useState<GymView>('routines');
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [activeRoutineId, setActiveRoutineId] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        await seedExercises();
        const [allRoutines, allExercises, allSessions] = await Promise.all([
            db.routines.toArray(),
            db.exercises.orderBy('name').toArray(),
            db.sessions.orderBy('date').reverse().toArray()
        ]);
        setRoutines(allRoutines);
        setExercises(allExercises);
        setSessions(allSessions);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const exerciseLookup = useMemo(() => {
        return new Map(exercises.filter(ex => ex.id !== undefined).map(ex => [ex.id!, ex]));
    }, [exercises]);

    const getExerciseName = useCallback((id: number) => {
        return exerciseLookup.get(id)?.name ?? 'Unknown';
    }, [exerciseLookup]);

    const getExerciseCategory = useCallback((id: number) => {
        return exerciseLookup.get(id)?.category ?? '';
    }, [exerciseLookup]);

    const activeRoutine = useMemo(() => {
        return routines.find(routine => routine.id === activeRoutineId) ?? null;
    }, [routines, activeRoutineId]);

    const returnToRoutines = useCallback(() => {
        setActiveRoutineId(null);
        setView('routines');
    }, []);

    const openRoutineDetail = useCallback((routine: Routine) => {
        setActiveRoutineId(routine.id ?? null);
        setView('routine_detail');
    }, []);

    const startSession = useCallback((routine: Routine) => {
        setActiveRoutineId(routine.id ?? null);
        setView('session');
    }, []);

    const openCreateRoutine = useCallback(() => {
        setView('create_routine');
    }, []);

    const openExerciseLibrary = useCallback(() => {
        setView('exercises');
    }, []);

    const openHistory = useCallback(() => {
        setView('history');
    }, []);

    const handleCreateRoutine = useCallback(async (payload: { name: string; dayLabel?: string; exercises: Routine['exercises'] }) => {
        await db.routines.add({
            name: payload.name,
            dayOfWeek: payload.dayLabel,
            exercises: payload.exercises
        });
        await loadData();
        setView('routines');
    }, [loadData]);

    const handleSaveRoutine = useCallback(async (updated: Routine) => {
        if (!updated.id) return;
        await db.routines.update(updated.id, {
            name: updated.name,
            dayOfWeek: updated.dayOfWeek,
            exercises: updated.exercises
        });
        await loadData();
        returnToRoutines();
    }, [loadData, returnToRoutines]);

    const handleDeleteRoutine = useCallback(async (id: number) => {
        await db.routines.delete(id);
        await loadData();
        if (activeRoutineId === id) {
            returnToRoutines();
        }
    }, [activeRoutineId, loadData, returnToRoutines]);

    const handleSaveSession = useCallback(async (sessionData: Record<number, { sets: WorkoutSet[] }>) => {
        if (!activeRoutine?.id) return;
        const updatedExercises = activeRoutine.exercises.map(ex => {
            const sets = sessionData[ex.exerciseId]?.sets ?? [];
            const lastSet = sets.length > 0 ? sets[sets.length - 1] : undefined;
            const nextWeight = lastSet && lastSet.weight > 0 ? lastSet.weight : ex.targetWeight;
            const nextReps = lastSet && lastSet.reps > 0 ? lastSet.reps : ex.targetReps;
            return {
                ...ex,
                targetSets: sets.length > 0 ? sets.length : ex.targetSets,
                targetWeight: nextWeight,
                targetReps: nextReps
            };
        });
        await db.routines.update(activeRoutine.id, {
            exercises: updatedExercises
        });

        await db.sessions.add({
            routineId: activeRoutine.id,
            routineName: activeRoutine.name,
            routineDay: activeRoutine.dayOfWeek,
            date: Date.now(),
            exercises: activeRoutine.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                sets: sessionData[ex.exerciseId]?.sets ?? []
            }))
        });

        await loadData();
        returnToRoutines();
    }, [activeRoutine, loadData, returnToRoutines]);

    if (view === 'exercises') {
        return <GymExerciseLibraryView onBack={returnToRoutines} />;
    }

    if (view === 'create_routine') {
        return <GymRoutineForm exercises={exercises} onBack={returnToRoutines} onSave={handleCreateRoutine} />;
    }

    if (view === 'routine_detail') {
        return activeRoutine ? (
            <GymRoutineDetail
                routine={activeRoutine}
                exercises={exercises}
                getExerciseName={getExerciseName}
                getExerciseCategory={getExerciseCategory}
                onBack={returnToRoutines}
                onStartSession={startSession}
                onSave={handleSaveRoutine}
            />
        ) : (
            <GymRoutineList
                routines={routines}
                onOpenRoutine={openRoutineDetail}
                onStartSession={startSession}
                onDeleteRoutine={handleDeleteRoutine}
                onOpenHistory={openHistory}
                onOpenLibrary={openExerciseLibrary}
                onCreateRoutine={openCreateRoutine}
                getExerciseName={getExerciseName}
            />
        );
    }

    if (view === 'session') {
        return activeRoutine ? (
            <GymSessionView
                routine={activeRoutine}
                getExerciseName={getExerciseName}
                getExerciseCategory={getExerciseCategory}
                onBack={returnToRoutines}
                onSaveSession={handleSaveSession}
            />
        ) : (
            <GymRoutineList
                routines={routines}
                onOpenRoutine={openRoutineDetail}
                onStartSession={startSession}
                onDeleteRoutine={handleDeleteRoutine}
                onOpenHistory={openHistory}
                onOpenLibrary={openExerciseLibrary}
                onCreateRoutine={openCreateRoutine}
                getExerciseName={getExerciseName}
            />
        );
    }

    if (view === 'history') {
        return <GymHistoryView sessions={sessions} onBack={returnToRoutines} />;
    }

    return (
        <GymRoutineList
            routines={routines}
            onOpenRoutine={openRoutineDetail}
            onStartSession={startSession}
            onDeleteRoutine={handleDeleteRoutine}
            onOpenHistory={openHistory}
            onOpenLibrary={openExerciseLibrary}
            onCreateRoutine={openCreateRoutine}
            getExerciseName={getExerciseName}
        />
    );
};
