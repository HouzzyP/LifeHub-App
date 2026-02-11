# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-11]
### Changed
- **Dashboard**: Redesigned from app grid to **widget-based summary view**.
  - Habits widget with animated progress ring and today's habit list (max 4).
  - Gym widget showing routine count and last session details.
  - Quick Access row for upcoming modules (Notes, Finance, Water, Focus).
  - Applied Vercel best practices: hoisted static data, ternary conditionals, `Promise.all`.

## [2026-02-11] (Gym Redesign)
### Changed
- **Gym Tracker**: Complete redesign from live-session tracker to **Routine Manager**.
  - Create named routines (e.g., "Chest Day") with selected exercises.
  - Start a session from a routine, fill in weight/reps per exercise.
  - Weight/reps auto-saved as defaults for the next session.
- **Database**: Added `Routine` table (Dexie v2 migration).
- Applied **Vercel React best practices**: `useCallback`, `Promise.all`, ternary conditionals, functional `setState`.

### Added
- Git repository initialized with initial commit.

## [2026-02-11] (earlier)
### Added
- **Gym Tracker Module**: Exercise Library with search, filter by category, and custom exercise creation.
- **Gym Workout Flow**: Start empty workout, add exercises, record sets (weight/reps), finish and save session.
- **Routine data model**: New `Routine` interface and database table (Dexie v2 migration) for pre-defined routines.
- **Playwright**: Configured for browser-based visual testing.
- **Skill**: Installed `vercel-react-best-practices` for code quality guidelines.

### Changed
- **App.tsx**: Integrated GymTracker and HabitDashboard with conditional routing.
- **Database schema**: Added `Routine` table with v2 migration in Dexie.

### Fixed
- Import path for `ExerciseLibrary` (`./components/ExerciseLibrary`).
- Import path for `db` in `ExerciseLibrary` (`../../../db/db`).

## [2026-02-10]
### Added
- Initial project structure (Vite + React + TypeScript + PWA).
- Custom skills: `changelogger`, `committer`, `premium-ui`.
- Dexie.js database configuration with tables for Habits, Exercises, Sessions, Notes.
- Global premium CSS system with Glassmorphism design tokens.
- Modular folder structure for Habits, Gym, and Notes.
- **Habit Tracker Module**: Full implementation with local persistence (Dexie).
- **Custom Icons**: Support for emojis in habit tracking.
- **Core Hub Dashboard**: Premium glassmorphic UI with animated app grid.
- **Bottom Navigation Bar**: Hub, Habits, Gym, Setup tabs with framer-motion animations.
