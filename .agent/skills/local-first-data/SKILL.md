---
name: local-first-data
description: "MANDATORY — You MUST read this file BEFORE creating or modifying ANY Dexie.js database code, queries, or data models. Non-negotiable. Best practices for local-first data management."
---

# Local-First Data — Dexie.js Best Practices

> [!CAUTION]
> **MANDATORY SKILL** — You MUST read this file and apply ALL rules BEFORE writing any database queries, schema changes, or data-layer code. Do NOT rely on memory. Do NOT skip this step.

## When This Skill MUST Be Applied
- Creating or modifying `db.ts` (schema, interfaces, migrations)
- Writing any `db.table.*` query in a component
- Adding seed data or bulk operations
- Any code that reads from or writes to IndexedDB

This skill defines patterns for managing persistent local data in LifeHub using **Dexie.js** (IndexedDB wrapper).

## Stack

- **Database**: Dexie.js v4+ (IndexedDB)
- **Location**: `src/db/db.ts`
- **Pattern**: Local-first — all data stays on device, no server

## Schema & Migrations

### Adding a New Table

1. Define the TypeScript `interface` in `db.ts`
2. Add a `Table<Interface>` property to the `LifeHubDB` class
3. Create a **new version** with `.stores()` — never modify existing versions

```typescript
// ✅ CORRECT: Add new version
this.version(2).stores({
  newTable: '++id, name'
});

// ❌ WRONG: Modifying version(1)
this.version(1).stores({
  habits: '++id, name',
  newTable: '++id, name' // Don't modify existing versions!
});
```

### Index Design

- Use `++id` for auto-increment primary keys
- Only index fields you will **query** or **sort by**
- Compound data (arrays, objects) should be stored as properties, not indexed

```typescript
// ✅ Good — index only queried fields
exercises: '++id, name, category'

// ❌ Bad — indexing everything
exercises: '++id, name, category, isCustom, description, imageUrl'
```

## Data Patterns

### Interfaces

- Always use `id?: number` (optional, auto-generated)
- Use `number` (timestamps) for dates, not strings
- Nested objects/arrays are fine — Dexie stores them as-is

```typescript
export interface Routine {
  id?: number;
  name: string;
  exercises: {           // Nested array, not indexed
    exerciseId: number;
    targetReps?: number;
    targetWeight?: number;
  }[];
}
```

### Querying

- Use `db.table.toArray()` for full lists
- Use `db.table.where('field').equals(value)` for filtered queries
- Use `db.table.orderBy('field')` for sorted results
- Use `Promise.all()` for parallel queries (Vercel: `async-parallel`)

```typescript
// ✅ Parallel loading
const [routines, exercises] = await Promise.all([
  db.routines.toArray(),
  db.exercises.orderBy('name').toArray()
]);

// ❌ Sequential (waterfall)
const routines = await db.routines.toArray();
const exercises = await db.exercises.orderBy('name').toArray();
```

### Writing

- Use `db.table.add(item)` to insert
- Use `db.table.update(id, changes)` to patch
- Use `db.table.put(item)` to upsert (insert or replace)
- Use `db.table.delete(id)` to remove

### Seeding Default Data

For tables that need default data (e.g., exercises):

```typescript
export async function seedExercises() {
  const count = await db.exercises.count();
  if (count === 0) {
    await db.exercises.bulkAdd(DEFAULT_EXERCISES);
  }
}
```

Call seed functions in `useEffect` with `useCallback` (Vercel: `rerender-functional-setstate`).

## React Integration

### Loading Data in Components

```typescript
const loadData = useCallback(async () => {
  const data = await db.table.toArray();
  setData(data);
}, []);

useEffect(() => {
  loadData();
}, [loadData]);
```

### After Mutations, Reload

```typescript
const addItem = async (item: Item) => {
  await db.table.add(item);
  await loadData(); // Refresh the list
};
```

## Rules Summary

| Rule | Description |
|---|---|
| New version per migration | Never modify existing `this.version(N)` |
| Minimal indexes | Only index fields you query/sort |
| `id?: number` | Always optional, auto-incremented |
| Timestamps as numbers | `Date.now()`, not ISO strings |
| `Promise.all` for queries | Avoid sequential waterfalls |
| Seed once | Check `count === 0` before seeding |
| `useCallback` + `useEffect` | For loading data in React |
| Reload after mutation | Call `loadData()` after add/update/delete |
