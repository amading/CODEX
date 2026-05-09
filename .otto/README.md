# OTTO Runtime Notes

This folder stores lightweight project notes for the OTTO workflow.

It must never contain secrets, API keys, tokens, passwords, database dumps, or `.env` contents.

## Files

- `agent-routing.md`: Human-readable routing map for OTTO agents.
- `agents/`: Individual files for each OTTO agent.
- `agent-communication.md`: Rules for how agents talk through logs.
- `approval-policy.md`: Approval mode and risky-action rules.
- `agent-protection-policy.md`: Protects OTTO agent files from unauthorized changes.
- `agent-upgrade-suggestions.md`: Proposed improvements before protected agent changes.
- `low-cost-auto-mode.md`: Default model/tool routing and cost-saving mode.
- `task-board.md`: Active tasks and assigned agents.
- `agent-messages.md`: Agent-to-agent handoffs.
- `decision-log.md`: Important decisions.
- `commands.md`: Slash command routing like `/post`, `/get`, `/config`.
- `scripts/github-push.ps1`: One-command GitHub add/commit/push helper.
- `projects/`: Per-project OTTO memory folders.
- `finalization-workflow.md`: Required checks and docs before saying done.
- `audit-log.md`: Change and action notes.
- `mistakes.md`: Mistakes, lessons, and retry-prevention notes.
