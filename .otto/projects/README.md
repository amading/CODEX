# OTTO Projects

Store one folder per project here.

## Folder Pattern

```text
.otto/projects/<project-name>/
  project.md
  notes.md
  tasks.md
  decisions.md
```

## Use

1. Create a project folder for the workspace area you are working on.
2. Copy the files from `_template/` into that folder.
3. Keep entries short, current, and factual.
4. Update notes as work changes.
5. Include file-by-file manual edit notes when code changes.
6. Add short comments to important changed files so the next person can edit them safely.

## Safety

- Do not store `.env` files.
- Do not store secrets, tokens, passwords, or database dumps.
- Keep project notes readonly-safe unless the user explicitly approves changes.
- Keep guide notes short enough to scan quickly.
