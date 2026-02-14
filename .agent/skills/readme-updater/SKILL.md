```skill
---
name: readme-updater
description: "MANDATORY — Keep README.md updated with new features, modules, and setup details after each change."
---

# README Updater Skill

> [!CAUTION]
> **MANDATORY SKILL** — You MUST update README.md after each meaningful change.

## When This Skill MUST Be Applied
- Adding or removing a feature or module
- Changing data storage or schema behavior
- Updating scripts, setup, or run instructions
- Any change that affects how users understand or use the app

## Instructions
1. **Locate README.md** at project root and update only relevant sections.
2. Keep updates concise and factual; avoid marketing tone.
3. Include:
   - New or changed features
   - Module status (ready vs planned)
   - Data storage details (local-first, IndexedDB/Dexie)
   - PWA or platform notes if impacted
4. Do not remove existing sections unless they are obsolete.

## Suggested Sections
- Overview
- Modules (Ready / Planned)
- Data Storage
- Tech Stack
- Scripts
- Roadmap (if applicable)

## Checklist
- [ ] README.md reflects the latest features
- [ ] Module list is current
- [ ] Storage details are accurate
- [ ] Scripts still match package.json
```
