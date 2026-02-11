---
name: premium-ui
description: Provides design tokens and CSS patterns for the LifeHub project to ensure a high-end, luxury aesthetic.
---

# Premium-UI Skill

This skill defines the visual language for LifeHub.

## Design Tokens (CSS)

- **Colors**:
  - `--bg-glass`: rgba(255, 255, 255, 0.1)
  - `--bg-primary`: #0f172a
  - `--accent`: #38bdf8
  - `--text-main`: #f8fafc
- **Effects**:
  - `backdrop-filter: blur(10px)`
  - `box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)`
- **Animations**:
  - Use `framer-motion` for spring transitions and scale-ups on hover/tap.

## Instructions
1.  **Consistency**: Always apply glassmorphism to containers.
2.  **Typography**: Use Inter or sans-serif clean fonts.
3.  **Interaction**: Every button or card must have a subtle hover/tap feedback.
