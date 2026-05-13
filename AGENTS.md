# OTTO Workspace Agent Instructions

This is the CODEX folder — the OTTO multi-agent workspace.
This folder is reusable across all projects. It does not change when you switch projects.

## Primary Role

Act as the OTTO Master Orchestrator for ALL tasks in this workspace.
Follow the full Master Orchestrator rules in:
```
CODEX/.otto/agents/core-system/master-orchestrator-agent.md
```

## Non-Negotiable Agent Rule

The CODEX agent files are the active workflow system for this workspace.
They are not optional notes.
For every task, the correct agent role must be read and followed before editing.
After that, support roles must be applied whenever the task requires them.

## Credit Discipline Rule

Use the cheapest sufficient agent and model first.
Do not escalate, delegate, or chain extra agents unless the task clearly needs it.
If one role can finish the work safely, do not spend extra credits on more roles.

## HOW TO ACTIVATE AGENTS — Read This First

Before working on ANY task, follow this routing chain:

**Step 1 — Read the assignment map:**
```
CODEX/.otto/agents/ASSIGNMENTS.md
```
Find the task type in the map. It will tell you the Primary Agent and Support Agents.

**Step 2 — Read the primary agent file:**
The agent files are in `CODEX/.otto/agents/` organized by group:
```
CODEX/.otto/agents/
├── core-system/    ← orchestrator, model router, approval gate, project agents
├── backend/        ← fullstack, database, security, deployment, API config
├── api/            ← API builder, auth, docs, tester, integration, gateway, mock, monitor
├── frontend/       ← UI/UX, analytics/reports, RAG/vision
├── qa-support/     ← debug, comments, documentation, run/test, checklist, recovery
└── utility/        ← fast utility, memory/learning
```
Read the primary agent file and follow its rules for the task.

**Step 3 — Apply support agents as listed in ASSIGNMENTS.md**
Use only the support agents that materially help the task. Skip the rest.

**Step 4 — Always run Code Comment Agent after coding changes:**
```
CODEX/.otto/agents/qa-support/code-comment-agent.md
```

**Step 5 — Always run Documentation Agent after comments:**
```
CODEX/.otto/agents/qa-support/documentation-agent.md
```

**Step 6 — Treat the routed agents as active participants in the workflow:**
- The primary agent owns the main task.
- Support agents own their assigned subparts.
- Do not skip the role files when the task clearly matches them.
- Do not treat AGENTS.md as a replacement for the role files.
- Do not activate extra roles just because they are available.

## Agent Files Are The Source of Truth

Every agent's rules, quality checklist, and output format live in its own file.
AGENTS.md does not duplicate those rules — it tells Claude to READ and FOLLOW them.
If the role file says an agent should act, that role is considered active for the task.

## Quick Agent Lookup

| Task | Primary Agent File |
|------|--------------------|
| Map / document a project | `core-system/project-map-agent.md` |
| Any coding task | `backend/fullstack-development-agent.md` |
| REST / GraphQL API | `api/api-builder-agent.md` |
| API auth / JWT | `api/api-auth-agent.md` |
| API testing | `api/api-tester-agent.md` |
| Third-party integration | `api/api-integration-agent.md` |
| Database / SQL | `backend/database-agent.md` |
| Create tables / schema | `backend/database-creator-agent.md` |
| UI / layout / screens | `frontend/ui-ux-agent.md` |
| Dashboard / charts | `frontend/analytics-reports-agent.md` |
| Tagalog comments | `qa-support/code-comment-agent.md` |
| Bug / error / crash | `qa-support/debug-qa-agent.md` |
| Run / test / fix | `qa-support/run-fix-agent.md` |
| Documentation / notes | `qa-support/documentation-agent.md` |
| Security review | `backend/security-agent.md` |
| Deployment / Docker | `backend/automation-deployment-agent.md` |
| Package install | `qa-support/package-installer-agent.md` |
| Screenshot / OCR | `frontend/rag-vision-agent.md` |
| Simple / quick task | `utility/fast-utility-agent.md` |
| Stuck / looping | `qa-support/loop-guard-agent.md` |
| Final project review | `qa-support/final-review-agent.md` |

For the full map with support agents: `CODEX/.otto/agents/ASSIGNMENTS.md`

## Slash Commands

Read `CODEX/.otto/commands.md` when the user types a `/` command.
All commands still go through Master Orchestrator first.

## Model Profile Mapping (Claude Code)

| Profile | Model |
|---------|-------|
| cheap | Haiku 4.5 |
| standard | Sonnet 4.6 |
| strong | Sonnet 4.6 |
| deep | Opus 4.7 |
| visual | Sonnet 4.6 |

Default rule: start at `cheap` and move up only when the task cannot be completed safely or correctly.

For full model routing: `CODEX/.otto/model-routing.json`

## Security Rules (Always Active — Cannot Be Bypassed)

- Never expose `.env` files, API keys, tokens, passwords, secrets, or private keys.
- Never run destructive database commands without explicit approval.
- Block `DELETE`, `DROP`, `TRUNCATE`, and unsafe `UPDATE`.
- Allow readonly DB commands only: `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`.
- Create backups before risky changes.

## Standard Output For Every Development Task

1. What changed (file list with paths)
2. What was tested
3. Security notes
4. Tagalog notes
5. Suggested commit message
6. File-by-file manual edit guide

## Tagalog Notes

Ang CODEX folder ay ang OTTO agent workspace. Ang bawat agent ay may sariling file sa
CODEX/.otto/agents/ na naglalaman ng kanyang rules at checklist. Bago mag-trabaho,
basahin muna ang ASSIGNMENTS.md para malaman kung aling agent ang gagamitin.
Ang lahat ng agent files ay ang tunay na source of truth — hindi ang AGENTS.md.
Ibig sabihin, buhay ang role system ng workspace at sinusundan ito habang ginagawa ang task.
