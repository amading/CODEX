# OTTO Agent Communication Protocol

All agents communicate through shared markdown logs. This keeps project memory clear without wasting tokens.

## Shared Files

| File | Purpose |
| --- | --- |
| `.otto/task-board.md` | Current task, assigned agents, status, last completed |
| `.otto/agent-messages.md` | Agent-to-agent messages and handoffs |
| `.otto/decision-log.md` | Important architecture/product decisions with reasons |
| `.otto/audit-log.md` | Chronological actions and file changes |
| `.otto/mistakes.md` | Mistakes (Mistake → Cause → Prevention Rule) with Pattern Watch |
| `.otto/active-project.md` | Currently locked active project and path |
| `.otto/agent-state.json` | Lightweight machine-readable state (active project, current owner, blockers) |
| `.otto/model-routing.json` | Provider model profiles: Claude, Codex, Cursor, OpenCode |
| `.otto/low-cost-auto-mode.md` | Default routing with Claude + Codex + OpenCode model IDs |

## Communication Flow

1. **Master Orchestrator** creates or updates the task in `.otto/task-board.md` with a one-line task summary.
2. **Primary agent** reads the latest 5 messages in `.otto/agent-messages.md` before starting.
3. **Primary agent** writes important handoffs to `.otto/agent-messages.md` using the message format below.
4. **Support agents** reply with short notes and blockers — one message per issue.
5. **Decisions** go to `.otto/decision-log.md` with: decision, reason, and how to apply.
6. **Mistakes** go to `.otto/mistakes.md` in Mistake → Cause → Prevention Rule format.
7. **Completed actions** go to `.otto/audit-log.md` with date and summary.
8. **Any blocker** must create a Reporter message AND a mistakes entry before stopping.
9. **If blocked twice** on the same issue: escalate to Recovery Agent + Reporter Agent, stop retrying same route.
10. **If task touches safety, data, or production**: include exact file name and action in every message.
11. **OpenCode tasks**: when OpenCode is used for backend work, log it in `audit-log.md` for cost tracking.
12. **Model used**: include the Claude or OpenCode model when it matters to the outcome.

## Message Format

```text
Date:
Message ID:
From:
To:
Topic:
Status:
Priority:
Needs:
Model Used:
Message:
Next Action:
```

Status values:
- `new`
- `in_progress`
- `blocked`
- `waiting_approval`
- `resolved`
- `closed`

Priority values:
- `low`
- `medium`
- `high`
- `critical`

Needs values (comma-separated):
- `none`
- `approval`
- `security_review`
- `db_review`
- `ui_review`
- `qa_review`
- `orchestrator_decision`
- `opencode_task`
- `model_escalation`
- `mistake_logged`
- `rollback_ready`

## Rules

- Keep messages short — one clear purpose per message.
- Stop repeated/looping messages — Loop Guard Agent handles repeats.
- Do not store secrets, `.env` contents, API keys, tokens, or passwords.
- Use this only for useful project memory — not for internal thinking.
- If an error repeats twice: escalate to Reporter Agent → Master Orchestrator Agent immediately.
- Include the next action whenever you create a blocker message.
- Use one message per issue — do not pile unrelated issues into one note.
- Always include `Model Used:` when the model choice affected the result.
- When using OpenCode for backend work, set `Needs: opencode_task` in the message.
- When escalating to a stronger model, set `Needs: model_escalation` and state the reason.
- When a mistake is recorded, set `Needs: mistake_logged` so Memory & Learning Agent is notified.
- Close resolved blockers — update status to `resolved` or `closed` when done.

## Before Acting Protocol

Every agent must do this before starting any task:

1. Read `.otto/active-project.md` — confirm the correct project.
2. Read the last 5 messages in `.otto/agent-messages.md` — check for blockers or context.
3. Confirm the task is within the active project scope.
4. If unclear: ask one short clarifying question before acting.
