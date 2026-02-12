---
name: component-refactoring
description: "MANDATORY — You MUST read this file BEFORE refactoring ANY React component or splitting code into smaller parts. Non-negotiable rules for maintaining LifeHub's modularity and performance."
---

# Component Refactoring Best Practices

> [!CAUTION]
> **MANDATORY SKILL** — You MUST read this file and apply ALL rules BEFORE refactoring. Do NOT rely on memory. Do NOT skip this step.

## When This Skill MUST Be Applied
- A component exceeds 200 lines of code.
- A component handles more than one primary responsibility.
- JSX logic contains deep nesting (3+ levels) or complex inline ternaries.
- You are extracting state or logic into custom hooks.
- You are moving code to a new file to improve modularity.

## Refactoring Rules

### 1. The "Single Responsibility" Rule
- Each component should do ONE thing (e.g., render a list, manage a modal, display a widget).
- Extract sub-components for repeated UI elements (cards, items, buttons).

### 2. Component Hoisting & Props
- Use **interface** for component props, never `any`.
- Hoist helper functions that don't depend on component state outside the component.
- Use `useCallback` for functions passed as props (Vercel: `rerender-functional-setstate`).

### 3. File Structure
- Module-specific components stay in `src/modules/{module}/components/`.
- Cross-module components go to `src/components/`.
- Shared logic goes to `src/hooks/` or `src/utils/`.

### 4. Performance & Best Practices
- Use `React.memo` only for expensive leaf components.
- Avoid large barrel files (`index.ts`) for internal module components.
- Use **ternary operators** for conditional rendering (Vercel: `rendering-conditional-render`).

## Enforcement Checklist
After refactoring, verify:
- [ ] No file exceeds 250 lines.
- [ ] Logic is separated from presentation (hooks vs components).
- [ ] Props are strictly typed.
- [ ] `useCallback` is used for all child-passed functions.
- [ ] Premium-UI (glassmorphism, animations) is preserved or improved.
- [ ] `App.tsx` imports only high-level module components.
