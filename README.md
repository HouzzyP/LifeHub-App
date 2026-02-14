# LifeHub

LifeHub is a mobile-first personal hub that bundles multiple mini-apps into a single experience. It is built as a PWA so it can run offline and be installed on mobile.

## Modules

### Ready
- Dashboard (overview of habits and gym progress)
- Habits (daily tracking, streaks, weekly view)
- Gym Tracker (Advanced)
  - Exercise library with search and filters
  - Custom exercises
  - Routines with optional day label, reorderable exercises, and per-exercise targets (sets/reps/weight)
  - Routine detail with View/Edit modes
  - Session logging with multi-set tracking (weight, reps, completed)
  - History with total volume summary and session details
- Notes (search, categories, pin/favorite, markdown preview)

### Planned
- Finance
- Water tracking
- Focus sessions
- Settings

## Data Storage
- Local-first (IndexedDB via Dexie)
- No backend required
- Data stays on the device

## Tech Stack
- React + TypeScript + Vite
- Dexie (IndexedDB)
- Framer Motion
- Lucide icons
- Vite PWA

## PWA
The app is configured as a PWA and can be installed on mobile from supported browsers.

## Scripts
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run test:e2e` - Run Playwright E2E tests

## Testing
LifeHub uses Playwright for E2E testing with full integration testing of user flows.

### Test Suites
- **Smoke Tests** (`e2e/tests/smoke.spec.ts`): Basic navigation and module loading
- **Gym Routine CRUD** (`e2e/tests/gym-routine.spec.ts`): Full routine creation, editing, and View/Edit mode switching

### Running Tests
```bash
# Run all tests
npm run test:e2e

# Run with browser visible
npx playwright test --headed

# Run specific test file
npx playwright test gym-routine.spec.ts

# Install browser dependencies (first time only)
npx playwright install
```
