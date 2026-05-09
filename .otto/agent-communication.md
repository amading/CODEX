# OTTO Agent Communication Protocol

All agents communicate through shared markdown logs. This keeps project memory clear without wasting tokens.

## Shared Files

| File | Purpose |
| --- | --- |
| `.otto/task-board.md` | Current task, assigned agents, status |
| `.otto/agent-messages.md` | Agent-to-agent messages and handoffs |
| `.otto/decision-log.md` | Important architecture/product decisions |
| `.otto/audit-log.md` | Actions and file changes |
| `.otto/mistakes.md` | Mistakes and prevention rules |
| `.otto/agent-state.json` | Lightweight machine-readable state (active project, current owner, blockers) |

## Communication Flow

1. Master Orchestrator creates or updates the task in `.otto/task-board.md`.
2. Primary agent writes important handoffs to `.otto/agent-messages.md`.
3. Support agents reply with short notes and blockers.
4. Decisions go to `.otto/decision-log.md`.
5. Mistakes go to `.otto/mistakes.md`.
6. Completed actions go to `.otto/audit-log.md`.
7. Any blocker must create a Reporter message and a mistake-prevention entry.
8. Before any new task, agents must read latest 5 messages in `.otto/agent-messages.md`.

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

## Rules

- Keep messages short.
- Stop repeated/looping messages.
- Do not store secrets.
- Do not paste `.env` contents.
- Do not store API keys, tokens, or passwords.
- Use this only for useful project memory.
- If an error repeats twice, escalate to `From: Reporter Agent` and `To: Master Orchestrator Agent`.
