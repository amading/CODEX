# OTTO Active Project Lock

Active Project: CODEX

Project Path:

```text
CODEX/
```

Last Updated: 2026-05-13

## What This Project Contains

- `.otto/` — All OTTO agent files, routing, system config, and memory logs
- `agents/` — 40 OTTO agents organized by group (backend, core-system, frontend, qa-support, utility)
- `model-routing.json` — Provider model profiles (Claude, Codex, Cursor, OpenCode)
- `commands.md` — All slash commands
- `finalization-workflow.md` — Required steps before saying done
- `mistakes.md` — Mistake prevention rules (Mistake → Cause → Prevention Rule)

## Rule

Before editing any file, confirm the requested work belongs to the active project.

If the user mentions a different project (e.g. `SAMELCII_WEB_SYSTEM`, `pages`), ask before switching.

Do not assume work on the outer workspace root means the active project changed.

## Previous Projects

| Project | Path | Status |
| --- | --- | --- |
| tic-toc-tips | `.otto/projects/tic-toc-tips/` | Completed |
| pos-web | `.otto/projects/pos-web/` | Completed |
| calculator-html | `.otto/projects/calculator-html/` | Completed |

## Switch Project

Use:

```text
/project <project-name>
```

Example:

```text
/project samelcii-web-system
```

This locks the active project and all agents must stay inside that project folder unless the user switches again.

## Safety

- Do not edit another project unless the user switches project with `/project`.
- Do not guess the project when multiple projects exist — ask.
- Do not touch `.env` or secrets.
- Do not mix files from different projects.
- Log project switches in `.otto/decision-log.md`.
