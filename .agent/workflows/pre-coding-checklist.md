---
description: MANDATORY pre-coding checklist. Run this workflow BEFORE writing or modifying any React component, CSS, or database code. This ensures all installed skills are applied consistently.
---

# Pre-Coding Skill Checklist

**This workflow is MANDATORY before writing or modifying code.**

## Steps

### 1. Identify which skills apply to the code you're about to write

| If you will touch... | You MUST read this skill FIRST |
|---|---|
| Any `.tsx` or `.jsx` file | `vercel-react-best-practices/SKILL.md` |
| Any UI component, styles, or visual elements | `premium-ui/SKILL.md` |
| Any database query, table, or Dexie code | `local-first-data/SKILL.md` |
| When splitting or refactoring a component | `component-refactoring/SKILL.md` |

### 2. Read the applicable SKILL.md files

Use `view_file` to read each applicable skill file BEFORE writing any code. Do not skip this step. Do not rely on memory.

### 3. Write the code

Now write the code, applying all rules from the skills you just read.

### 4. Post-write verification

After writing the code, verify against each skill's rules:

**Vercel React checklist:**
- [ ] `useCallback` for functions passed as props or used in effects
- [ ] `Promise.all()` for parallel async operations
- [ ] Ternary `? :` instead of `&&` for conditional rendering
- [ ] Functional `setState` where applicable
- [ ] Static data hoisted outside components
- [ ] No barrel file imports
- [ ] Early returns in functions

**Premium-UI checklist:**
- [ ] `glass-container` class on all card/panel containers
- [ ] CSS variables from design tokens (not hardcoded colors)
- [ ] `framer-motion` animations on entries and interactions
- [ ] `whileTap={{ scale: 0.98 }}` on interactive elements
- [ ] Inter / Outfit font usage
- [ ] Gradient icon wrappers

**Local-First-Data checklist:**
- [ ] New DB version (not modifying existing) for schema changes
- [ ] `id?: number` with `++id` auto-increment
- [ ] Timestamps as `number` (Date.now())
- [ ] `useCallback` + `useEffect` for data loading
- [ ] `Promise.all` for parallel queries
- [ ] Reload data after mutations
