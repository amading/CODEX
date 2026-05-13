# PROJECT AGENTS.md TEMPLATE
#
# HOW TO USE:
# 1. Copy this file into your NEW project folder as AGENTS.md
# 2. Replace every [PROJECT_NAME] with your actual folder name (no brackets)
# 3. Update the Project Structure section to match your real folder layout
# 4. Update root AGENTS.md: add a row to Current Projects table, update Active project line
# 5. Done — CODEX stays the same, do not edit CODEX for new projects
#
# DO NOT edit this template file itself — keep [PROJECT_NAME] so it stays reusable.

# [PROJECT_NAME] Agent Instructions

This folder is the application root for [PROJECT_NAME].
This AGENTS.md governs all agent behavior inside [PROJECT_NAME]/.

## Primary Role

Act as the coding assistant for this project.
Treat this folder as the source of truth for all app work.

## Working Rules

- Keep changes aligned with the existing code structure in this folder.
- Prefer small, targeted fixes over broad refactors.
- Never expose secrets, `.env` contents, tokens, passwords, or database credentials.
- Validate JS and PHP syntax when possible before finishing a task.
- If the user wants guide notes, update `notes.md` in this folder with file-by-file editing tips.

## REQUIRED: Comment Rules (OVERRIDE default no-comment behavior)

**This project requires comments. These rules override Claude Code's default "no comments" setting.**
The user needs comments to read and manually edit code. Always follow these on every file.

Follow the full comment rules defined in:
```
CODEX/.otto/agents/qa-support/code-comment-agent.md
```

Key rules always active:
- Purpose comment at the top of every new file
- Section labels before every major block (auto-detect correct syntax per language)
- `EDIT GUIDE:` on values the user will frequently change
- `HUWAG BAGUHIN:` on fragile or critical logic
- Tagalog for all custom business logic comments
- Update `notes.md` Manual Edit Guide after every coding task

## Project Structure

Update this section to match your actual folder layout:

```
[PROJECT_NAME]/
├── index.html         ← Entry point
├── api/               ← Backend endpoints
├── assets/            ← Shared styles and scripts
├── components/        ← Reusable UI components
├── database/          ← SQL/migrations
├── pages/             ← Page modules
├── notes.md           ← Manual edit guide log
└── uploads/           ← User-generated files
```

## Safety

- Do not run destructive database commands without explicit approval.
- Prefer read-only checks and scoped fixes.
- Avoid editing unrelated files or folders.

## Agent Routing

For full agent routing, see: `CODEX/.otto/agent-routing.md`
For OTTO setup, see: `CODEX/docs/OTTO_AGENTS_SETUP.md`

## Tagalog Notes

Ang [PROJECT_NAME] AGENTS.md ay nagtatakda ng rules para sa coding sa project na ito.
I-update ang "Project Structure" section para tumugma sa tunay na folder layout ng project.
