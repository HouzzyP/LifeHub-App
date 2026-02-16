# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-16] (Phase 6: Notes Localization + Context Snapshot)
### Added
- **Notes localization (EN/ES)** across editor, filters, empty states, and time-ago labels.
- **Context snapshot tooling**:
  - `scripts/context-snapshot.mjs` generates a structured project snapshot.
  - `context/context.json` stores the latest snapshot output.
  - `npm run context:snapshot` script for easy refresh.
- **Notes E2E Page Object**: `e2e/pages/notes.page.ts` for resilient Playwright navigation.

### Changed
- **Notes UI**: filters, titles, and category labels now use centralized strings.
- **Notes editor**: aria labels, placeholders, autosave copy localized.
- **Navigation bar**: `NavItem` converted to button for better accessibility and testability.
- **Notes tests**: navigation now uses "More" menu flow.

## [2026-02-13] (Phase 5: PWA - Minimal Install Banner - OPTIMIZED ✅)
### Added
- **Minimal Install Banner** (Clean & Non-Intrusive):
  - `usePWAInstall()` hook: Listens to native `beforeinstallprompt` event
  - Small banner at bottom of screen (like offline indicator)
  - Button "Instalar" triggers native browser install
  - Dismissible with X button - remembers dismissal in localStorage
  - Only shows when browser has PWA criteria met (not shown after rejection)
  - Works on Android Chrome/Edge when criteria are met
  - On iOS: No banner shown (use "Agregar a pantalla de inicio" manually)

- **APP Installation (Standalone Mode)**:
  - When installed correctly, **opens WITHOUT Chrome UI** (display-mode: standalone)
  - Appears as native app on home screen
  - Automatic updates handled by service worker
  - Works offline completely
  - No difference from native app for user experience

- **Why This Approach**:
  - ✅ **Clean UI**: Single small banner instead of giant modal
  - ✅ **Native Install**: Uses Chrome's official `beforeinstallprompt` API
  - ✅ **Smart**: Only shows when browser can actually install
  - ✅ **Respects user**: One dismissal = won't show again (localStorage)
  - ✅ **Mobile optimized**: Appears above bottom navbar
  - ✅ **No modal tutorials**: Lets browser do the talking
  - ✅ **Accessible**: Proper ARIA labels and semantic HTML

### About Installation

**🤖 Android Chrome/Edge:**
1. Banner appears if Google's criteria are met
2. Click "Instalar" → Chrome shows official prompt
3. Confirm → App installed on home screen as native app
4. Opens in standalone mode (no Chrome UI)

**🍎 iOS:**
- No automatic banner (Apple limitation)
- Manual: Safari → Share → "Agregar a pantalla de inicio"
- Opens in webapp mode (same experience as Android)

**💻 Windows/Mac/Linux:**
- Download icon appears in Chrome → Install button
- Installs to applications folder / desktop

### Offline Detection & UX
- `useOnline()` hook: Detects connectivity changes
- `OfflineIndicator`: Bottom banner when connection lost
- Auto-sync on reconnect via service worker

### Service Worker & Storage
- Static assets cached for 30 days (Cache-First)
- Workbox precaching 520+ KiB
- All changes persist offline automatically
- Syncs when connection restored

## [2026-02-13] (Phase 5: PWA - Smart Install Prompt - INITIAL)

## [2026-02-13] (Phase 5: PWA Offline Support - Initial Implementation)
  - Detected by checking `display-mode: standalone` media query
  - Keyboard accessible (Enter key support, proper tabIndex)
  - aria-label for screen readers

- **Progressive Web App (PWA) Installation**:
  - Enhanced web app manifest with complete metadata (name, short_name, description, start_url, display: standalone)
  - **PNG icons (192x192 and 512x512)** generated from SVG with sharp - Chrome mobile requires PNG for install banner
  - Maskable PNG icons for adaptive icons on Android
  - Apple mobile web app meta tags for iOS installation support
  - Theme color and status bar styling for native app appearance
  - Auto-icon generation script: `npm run generate:icons`

- **Offline Detection & UX**:
  - `useOnline()` hook: Detects online/offline status with 500ms debounce
  - `OfflineIndicator` component: Sticky bottom banner showing offline status (Tailwind animations)
  - Real-time connectivity feedback with "Changes will sync when reconnected" messaging
  - aria-live status region for screen reader announcements

- **Service Worker & Caching Strategy**:
  - Custom service worker (src/sw.ts) with install/activate/fetch lifecycle
  - Cache-first strategy: Static assets (JS, CSS, PNG) cached for 30 days
  - Network-first fallback: HTML requests fall back to cached version or offline page
  - Automatic cache cleanup: Old caches deleted on activation
  - Update detection: Service worker messages logged when new version available

- **Workbox Configuration**:
  - vite-plugin-pwa integrated with globPatterns for asset precaching (517.94 KiB)
  - Runtime caching for assets and images with expiration policies
  - Automatic generation of dist/sw.js and dist/manifest.webmanifest

- **Sync Manager (src/db/syncManager.ts)**:
  - Tracks pending database changes (create, update, delete) for eventual backend sync
  - Queue automatically populated when notes/habits are saved offline
  - Sync status listeners for UI indicators (isSyncing state)
  - `useSyncManager()` hook exposes queue, stats, and sync methods

### Technical Details
- **Service Worker Scope**: / (entire app)
- **Workbox Cache Names**: lifehub-cache-v1 (with automatic cleanup)
- **Debounce**: 500ms for online/offline status changes (prevents flapping)
- **Offline Fallback**: Returns simple HTML page or empty response for failed requests
- **Browser Support**: All modern browsers (works on HTTP for local development without HTTPS)
- **Install Timing**: Custom button shows 2 seconds after page load for better UX

### Installation Flow (Now Works Consistently)
1. User opens app in browser (HTTP or HTTPS)
2. App loads, service worker registers
3. Browser triggers beforeinstallprompt event (if PWA criteria met)
4. Custom "Instalar LifeHub" button appears after 2 seconds
5. User clicks button → full install prompt appears
6. After install, button hides automatically
7. App icon shows on home screen

## [2026-02-13] (Phase 4: Accessibility & UX Improvements)
### Added
- **WCAG 2.2 Level AA Compliance**:
  - Comprehensive ARIA labels on all interactive buttons (toggle, pin, favorite, delete, create)
  - `aria-pressed` attributes for toggle buttons (preview, pin, favorite, completion)
  - `aria-modal="true"` and `aria-labelledby` on AddHabitModal for proper dialog semantics
  - Focus management: Escape key closes modals, proper modal aria-hidden for backdrop
  - `aria-live="polite" aria-atomic="true"` on auto-save indicator for screen reader announcements
  - `role="group"` on button groups (category chips, icon selector) with grouped aria-labels

- **Touch Target Sizing**: Minimum 44x44px for all interactive elements (WCAG 2.2 2.5.8)
  - Updated all buttons with `minHeight: '44px'` and `minWidth: '44px'`
  - Ensures mobile accessibility on iOS/Android

- **Keyboard Navigation**:
  - Escape key support on AddHabitModal (FocusTrap pattern) and NoteEditor
  - Enter key to submit forms (Create Habit, Create Note)  
  - Full Tab navigation support for all interactive elements

- **Form Accessibility**:
  - Added `htmlFor` attributes linking labels to inputs (habit-name input)
  - `aria-required="true"` on required fields (title, habit name)
  - `aria-describedby` on textarea pointing to help text (`#content-help`)
  - Screen-reader-only help text for markdown formatting support

- **CSS Utility**: Added `.sr-only` class for visually hidden but screen-reader-visible content

### Changed
- **HabitCard.tsx**: Added aria-labels and aria-pressed to toggle/delete buttons, increased touch targets
- **AddHabitModal.tsx**: Added role="dialog", aria-modal, focus management (Escape key), grouped form controls with aria-labels
- **NoteEditor.tsx**: 
  - All buttons now have aria-labels, aria-pressed, and title attributes
  - Title input has aria-label and aria-required
  - Content textarea has aria-label and aria-describedby
  - Category chips have aria-pressed and grouped with role="group"
  - Auto-save indicator uses aria-live region for dynamic announcements

### Technical Details
- Semantic HTML structure maintained (using role attributes appropriately)
- No breaking changes to existing functionality - accessibility is additive
- Accessible names are automatically generated from aria-label, aria-labelledby, and text content

## [2026-02-13] (Phase 1-3: Data Persistence & Component Refactoring)
### Fixed
- **Database Schema Migration**: Fixed critical bug where Dexie v3 migration was missing tables (habits, exercises, sessions, routines). All migration versions (v1/v2/v3) now include complete table definitions to prevent data loss.
- **Notes Auto-Save Debounce**: Replaced circular dependency pattern with `useRef` callback state pattern. Debounce now correctly captures latest state without resetting timeout on every keystroke (800ms delay).
- **Async/Await Consistency**: Fixed missing `await` statements in NoteEditor.tsx (back button) and NotesDashboard.tsx (loadNotes) to ensure data persists before UI navigation.

### Added
- **Error Handling**: Comprehensive try-catch blocks with console.error logging on all database operations (loadNote, saveNote, deleteNote, loadNotes, loadHabits, etc.).
- **Auto-Save Indicator**: Visual feedback in NoteEditor showing "💾 Saving..." vs "✓ Auto-saved" status.
- **E2E Testing Suite**: 
  - Playwright tests for Habits CRUD (create, toggle, display progress, navigate) - 6 tests
  - Playwright tests for Notes navigation and rendering - 2 tests
  - Smoke test for general navigation
  - Gym routine CRUD test (pre-existing, now validated)
  - **All 9 tests passing** with proper cross-browser support (Chromium, Firefox, WebKit)

### Changed
- **Notes Component Architecture**:
  - Split monolithic `NotesDashboard.tsx` (265 lines → 82 lines) using coordinator pattern
  - Created `components/NoteCard.tsx` (70 lines): Individual note card with preview, timestamps, pin/favorite indicators
  - Created `components/NotesHeader.tsx` (95 lines): Search bar, category filter chips, create button
  - Created `components/NotesPinnedSection.tsx` (26 lines): Pinned notes display
  - Created `components/NotesGrid.tsx` (56 lines): Main notes grid with empty state
  
- **Habits Component Architecture**:
  - Split monolithic `HabitDashboard.tsx` (369 lines → 133 lines) using coordinator pattern
  - Created `components/HabitCard.tsx` (120 lines): Icon, name, streak counter (🔥), toggle button, delete, weekly dot grid (M-S)
  - Created `components/HabitProgressBar.tsx` (35 lines): Animated progress showing X/Y habits completed today
  - Created `components/AddHabitModal.tsx` (101 lines): Bottom sheet modal with icon picker (10 emoji options) and habit name input
  - Added error handling to all habit operations (addHabit, toggleHabit, deleteHabit)

### Technical Improvements
- All new components follow `<250 line` rule per Vercel React best practices skill
- Component extraction improves testability and maintainability
- Error logging enables debugging of data persistence issues
- TypeScript compilation all passes (no errors)

## [2026-02-13]
### Added
- **Skills Expansion**: Added specialized skills for `playwright-testing`, `accessibility-compliance`, and `pwa-development`.

### Changed
- **Gym UI**: Routine list now stays compact with name, optional day label, and exercise preview.



## [2026-02-11] (Gym Enhancements)
### Added
- **Gym Tracker**: Routine day labels, reorderable exercises, multi-set session logging, and workout history with total volume.
- **Skill**: `readme-updater` to keep README.md in sync with new features.

### Changed
- **Premium UI Skill**: Tokens and effects aligned with current CSS design system.
- **Data Model**: Added routine day and session linkage fields to local data types.
- **README**: Replaced template with LifeHub-specific documentation.

## [2026-02-11] (Notes Module)
### Added
- **Notes Module (Advanced)**: Full note-taking with markdown preview, auto-save, pin/favorite, category filters, search.
  - `NotesDashboard.tsx`: search bar, category chips, pinned section, NoteCard sub-component.
  - `NoteEditor.tsx`: markdown rendering (bold/italic/headers/lists/code), debounced auto-save, pin/fav toggles.
  - Extended `Note` interface with `category`, `isPinned`, `isFavorite`, `createdAt`. DB version 3.

## [2026-02-11] (Dashboard)
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
