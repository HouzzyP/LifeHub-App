---
name: premium-ui
description: "MANDATORY — You MUST read this file BEFORE writing or modifying ANY UI component, CSS, or visual element. Non-negotiable. Design tokens and patterns for LifeHub's premium aesthetic."
---

# Premium-UI Skill

> [!CAUTION]
> **MANDATORY SKILL** — You MUST read this file and apply ALL rules BEFORE writing or modifying any UI component, styles, or visual elements. Do NOT rely on memory. Do NOT skip this step.

## When This Skill MUST Be Applied
- Creating or modifying any component with visible UI
- Writing or editing CSS / inline styles
- Adding animations or transitions
- Anything the user will see on screen

## Design Tokens (CSS)

- **Colors**:
  - `--bg-primary`: #020617
  - `--bg-secondary`: #0f172a
  - `--bg-glass`: rgba(15, 23, 42, 0.6)
  - `--bg-glass-heavy`: rgba(15, 23, 42, 0.85)
  - `--accent`: #38bdf8
  - `--accent-secondary`: #818cf8
  - `--text-main`: #f1f5f9
  - `--text-dim`: #94a3b8
  - `--glass-border`: rgba(255, 255, 255, 0.08)
- **Effects**:
  - `backdrop-filter: blur(20px)`
  - `box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3)`
- **Animations**:
  - Use `framer-motion` for spring transitions and scale-ups on hover/tap.

## Instructions
1. **Consistency**: Always apply glassmorphism (`.glass-container` class) to containers.
2. **Typography**: Use Inter (body) and Outfit (headings) fonts.
3. **Interaction**: Every button or card must have a subtle hover/tap feedback (`whileTap={{ scale: 0.98 }}`).
4. **Gradients**: Icon wrappers use `linear-gradient(135deg, [color], #1e293b)`.
5. **Spacing**: `border-radius: 16px–32px`, padding `20px–24px` on cards.

## Enforcement Checklist
After writing code, verify:
- [ ] All containers have `.glass-container` class
- [ ] Colors use CSS variables, not hardcoded hex values
- [ ] `framer-motion` animations on component entry (`initial`, `animate`)
- [ ] `whileTap={{ scale: 0.98 }}` on all clickable elements
- [ ] Inter/Outfit fonts (no browser defaults)
- [ ] Gradient icon wrappers where applicable
