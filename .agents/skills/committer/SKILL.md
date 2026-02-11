---
name: committer
description: Standardizes Git commits with a clear title and coherent description. Run this AFTER changelogger.
---

# Committer Skill

This skill helps maintain a high-quality commit history.

## Instructions

1.  **Title**: Use a concise, imperative title (e.g., "Add habit tracking module").
2.  **Description**: Provide a coherent explanation of *what* changed and *why*.
3.  **Order**: Ensure the `CHANGELOG.md` has been updated by the `changelogger` skill before committing.
4.  **Command**: Use `git commit -m "[Title]" -m "[Description]"`

## Usage
Run this skill after the `changelogger` skill has completed its task.
