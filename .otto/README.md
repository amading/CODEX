# OTTO Runtime Notes

This folder stores lightweight project notes for the OTTO workflow.

It must never contain secrets, API keys, tokens, passwords, database dumps, or `.env` contents.

## Active AI Runtime

Claude Code (claude-sonnet-4-6) — no OpenCode installation required.

## Files

- `agent-routing.md`: Human-readable routing map for all 40 OTTO agents.
- `model-routing.json`: Provider-flexible model profiles (Codex, Cursor, Claude). Claude IDs: haiku-4-5, sonnet-4-6, opus-4-7.
- `agents/`: Individual instruction files for all 40 OTTO agents (backend, core-system, frontend, qa-support, utility).
- `agent-communication.md`: Rules for how agents communicate through shared log files.
- `approval-policy.md`: Approval mode, risk rating scale (safe/low/medium/high/critical), and risky-action rules.
- `agent-protection-policy.md`: Protects OTTO agent files from unauthorized changes.
- `agent-upgrade-suggestions.md`: Proposed improvements before protected agent changes.
- `agent-upgrade-checklist.md`: 100-item upgrade checklist for comment/docs/manual-edit rules.
- `low-cost-auto-mode.md`: Default model routing with Claude model IDs per profile.
- `task-board.md`: Active tasks, assigned agents, and last completed work.
- `agent-messages.md`: Agent-to-agent handoffs and broadcast messages.
- `decision-log.md`: Important architectural and product decisions with reasons.
- `commands.md`: All slash commands — `/post`, `/get`, `/run`, `/debug`, `/finalize`, and more.
- `scripts/github-push.ps1`: One-command GitHub add/commit/push helper.
- `projects/`: Per-project OTTO memory folders (project.md, tasks.md, decisions.md, notes.md).
- `finalization-workflow.md`: Step-by-step required checks and done-rule checklist before saying done.
- `audit-log.md`: Chronological change and action log.
- `mistakes.md`: Mistakes, lessons, and retry-prevention rules.
- `active-project.md`: Currently locked active project.
- `project-generator-workflow.md`: End-to-end workflow for creating a full project from an idea.
