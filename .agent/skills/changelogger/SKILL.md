---
name: changelogger
description: Automatically logs changes to a CHANGELOG.md file in a standardized format. Run this BEFORE committer.
---

# Changelogger Skill

This skill ensures every significant update is documented in the `CHANGELOG.md` file located at the project root.

## Instructions

1.  **Identify Changes**: Review the changes made in the current step.
2.  **Update CHANGELOG.md**: Append a new entry under the current date.
3.  **Format**:
    ```markdown
    ## [YYYY-MM-DD]
    ### Added
    - [feature]
    ### Changed
    - [modified behavior]
    ### Fixed
    - [bug fix]
    ```

## Usage
Run this skill immediately after finishing a set of changes and BEFORE running the `committer` skill.
