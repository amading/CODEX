# OTTO Task Board — v2.0

Central coordination hub for all agent work across all projects.
All agents read this file before starting. All agents update it when status changes.
Reference: [agent-routing.md](agent-routing.md) | [finalization-workflow.md](finalization-workflow.md) | [agent-upgrade-checklist.md](agent-upgrade-checklist.md)

---

## WORKSPACE LOCK

| Field | Value |
|-------|-------|
| Active Project | CODEX |
| Project Root | `\\192.168.1.99\htdocs\SAMELCII_WEB_SYSTEM\` |
| Locked By | Master Orchestrator Agent |
| Lock Status | ACTIVE |
| Cross-Project Writes | DISABLED — requires explicit user approval |

> To switch the active project: update Active Project above + confirm from root `AGENTS.md`.
> Never edit files outside the Active Project folder unless the user names the target explicitly.

---

## AGENT STATUS

| Agent | Profile | Status | Assigned To |
|-------|---------|--------|-------------|
| Master Orchestrator | cheap | ACTIVE | — |
| Task Manager | cheap | ACTIVE | — |
| Planning | strong | STANDBY | — |
| Coding | standard | STANDBY | — |
| UI/UX | visual | STANDBY | — |
| SQL / Database | strong | STANDBY | — |
| Database Readonly | strong | STANDBY | — |
| Database Guard | cheap | ALWAYS ON | All DB tasks |
| Data Validator | standard | ALWAYS ON | All DB writes |
| ENV Protection | cheap | ALWAYS ON | All tasks |
| Secret Guard | cheap | ALWAYS ON | All tasks |
| Permission Guard | cheap | ALWAYS ON | All tasks |
| Security | strong | STANDBY | — |
| Debug & QA | standard | STANDBY | — |
| Refactor | standard | STANDBY | — |
| API Integration | standard | STANDBY | — |
| Automation | standard | STANDBY | — |
| RAG & Search | standard | STANDBY | — |
| Memory | cheap | STANDBY | — |
| Documentation | cheap | STANDBY | — |
| Tagalog Notes | cheap | STANDBY | — |
| Vision | visual | STANDBY | — |
| Commit | cheap | STANDBY | — |
| Retry Prevention | cheap | ALWAYS ON | All tasks |
| Summarizer | cheap | STANDBY | — |
| Fast Chat | cheap | STANDBY | — |

> ALWAYS ON agents cannot be set to STANDBY or DISABLED.
> Update ASSIGNED TO when an agent is actively working a task.

---

## KANBAN BOARD

### BACKLOG

| ID | Task | Priority | Agent | Notes |
|----|------|----------|-------|-------|
| — | — | — | — | — |

### IN PROGRESS

| ID | Task | Agent | Started | Blocked By |
|----|------|-------|---------|------------|
| — | — | — | — | — |

### BLOCKED

| ID | Task | Agent | Blocker | Blocker Type | Escalate To |
|----|------|-------|---------|--------------|-------------|
| — | — | — | — | — | — |

> Blocker types: `security` / `missing-req` / `test-failure` / `user-input` / `dependency` / `permission`

### IN REVIEW

| ID | Task | Reviewer Agent | Confidence | Notes |
|----|------|---------------|------------|-------|
| — | — | — | — | — |

### DONE

| ID | Task | Completed | Commit Msg | Notes |
|----|------|-----------|------------|-------|
| — | — | — | — | — |

---

## REQUIREMENT REGISTRY (REQ-###)

Every feature or fix must have a REQ-### ID before work begins.
No agent builds a feature without a REQ-### ID — completeness cannot be verified without one.

| ID | Description | Status | Agent | Priority |
|----|-------------|--------|-------|----------|
| — | — | — | — | — |

> Status options: `pending` / `in-progress` / `partial` / `done` / `cancelled`
> Priority options: `critical` / `high` / `medium` / `low`

---

## BLOCKER REGISTRY

Active blockers that prevent task progress. Must be resolved or explicitly deferred.

| ID | Blocker Description | Type | Affects | Raised By | Status |
|----|---------------------|------|---------|-----------|--------|
| — | — | — | — | — | — |

> Status options: `open` / `in-progress` / `resolved` / `deferred (reason)`
> Never close a blocker without updating status. Never leave status blank.

---

## PATTERN WATCH ALERTS

Repeated mistakes that have reached Pattern Watch threshold (count ≥ 2).
Retry Prevention Agent monitors this list every session.

| Mistake | Count | Prevention Rule | Escalate at |
|---------|-------|-----------------|-------------|
| — | — | — | count = 3 |

> At count = 3: escalate to Agent Upgrade Advisor + add entry to `CODEX/.otto/memory/mistakes.md`.

---

## SESSION LOG

Append one line per session. Most recent at the top. Keep last 30 entries.

| Date | Action | Agent | Files Touched |
|------|--------|-------|---------------|
| 2026-05-13 | Upgraded agent-routing.md to v2.0 | Master Orchestrator | `CODEX/.otto/agent-routing.md` |
| 2026-05-13 | Upgraded agent-upgrade-checklist.md to v2.0 | Master Orchestrator | `CODEX/.otto/agent-upgrade-checklist.md` |
| 2026-05-13 | Upgraded finalization-workflow.md to v2.0 | Master Orchestrator | `CODEX/.otto/finalization-workflow.md` |
| 2026-05-13 | Added Claude Model IDs to all 40 agent files | Master Orchestrator | All agent files |
| 2026-05-13 | Upgraded all agent Super Agent Mode sections | Master Orchestrator | All agent files |
| 2026-05-13 | Upgraded system files (audit-log, approval-policy, finalization-workflow, low-cost-auto-mode, decision-log, agent-messages, project-generator-workflow) | Master Orchestrator | Multiple system files |

---

## CURRENT ACTIVE HANDOFF

When an agent hands off to another, paste the handoff block here until it is received.
Clear this section after the receiving agent confirms receipt.

```
HANDOFF BLOCK: (empty — no active handoff)
  from:
  to:
  task_summary:
  files_touched:
  decisions_made:
  open_questions:
  risk_flags:
```

---

## SECURITY STATUS

| Guard | Status | Last Checked |
|-------|--------|-------------|
| Database Guard | ACTIVE | 2026-05-13 |
| ENV Protection | ACTIVE | 2026-05-13 |
| Secret Guard | ACTIVE | 2026-05-13 |
| Permission Guard | ACTIVE | 2026-05-13 |

> Any guard showing INACTIVE is a critical blocker — stop all work immediately.
> Security findings log: `CODEX/.otto/memory/security-log.md`

---

## OPEN QUESTIONS

Questions from agents that require user input before work can continue.

| ID | Question | Raised By | Raised On | Status |
|----|----------|-----------|-----------|--------|
| — | — | — | — | — |

> Status: `open` / `answered` / `deferred`
> Answered questions should be archived — do not delete, move to a note in `decisions.md`.

---

## DECISION LOG (Quick Reference)

Major decisions made this session. Full log: `CODEX/.otto/memory/decisions.md`

| Date | Decision | Reason | Made By |
|------|----------|--------|---------|
| 2026-05-13 | Upgraded all OTTO system files to v2.0 | Align with stronger agent routing, security enforcement, and finalization workflow | Master Orchestrator |

---

## CREDIT & MODEL USAGE TRACKER

| Session Date | Tasks Run | Cheap Calls | Standard Calls | Strong Calls | Deep Calls | OpenCode Calls |
|-------------|-----------|-------------|----------------|--------------|------------|----------------|
| 2026-05-13 | System upgrades | — | — | — | — | — |

> Full audit: `audit-log.md`
> Goal: always use the cheapest sufficient model. Escalate only when capability is the bottleneck.

---

## TASK BOARD RULES

### Rule 1 — Read this file before starting any task
Every agent reads this board to know: active project, active tasks, blockers, and pattern watch alerts.

### Rule 2 — Update this file when status changes
When a task moves from Backlog → In Progress → Blocked → Review → Done,
update the Kanban Board immediately. Do not let it go stale.

### Rule 3 — Every task needs a REQ-### before work starts
No agent builds a feature without a REQ-### in the Requirement Registry.
If the user did not provide one, create it here before coding begins.

### Rule 4 — Blockers are never left open silently
Every blocker gets a status. When resolved, update to `resolved` — never just delete the row.

### Rule 5 — Session Log is updated every session
One line per session, most recent first. Keep last 30 entries. Trim oldest when over 30.

### Rule 6 — Handoff block is pasted here when active
When one agent hands off to another, the handoff block goes in the Current Active Handoff section.
Clear it only after the receiving agent confirms receipt.

### Rule 7 — Open Questions block all dependent work
If a question requires user input, the dependent task stays in BLOCKED until answered.

### Rule 8 — Pattern Watch is checked every session
Retry Prevention Agent reads the Pattern Watch table at the start of every session.
If any item hits count = 3, escalate before doing anything else.

### Rule 9 — Security status must show all guards ACTIVE
If any guard shows INACTIVE, stop all work and resolve before continuing.

### Rule 10 — This file is never a secret store
Do not write API keys, passwords, tokens, or `.env` values here. Ever.

---

## Tagalog Notes

Ang task board na ito ay ang sentral na koordinasyon ng lahat ng agents.
Lahat ng agents ay nagbabasa nito bago magsimula ng trabaho.
Lahat ng agents ay nag-a-update nito kapag nagbago ang status ng isang task.

Ang mga ALWAYS ON na agents (Database Guard, ENV Protection, Secret Guard, Permission Guard, Retry Prevention)
ay hindi maaaring i-standby o i-disable — palagi silang aktibo sa lahat ng tasks.

Ang bawat feature ay kailangan ng REQ-### ID bago simulan ang coding.
Ang bawat blocker ay kailangan ng status — hindi maaaring iwanang blangko o walang update.
Ang Pattern Watch ay sinusuri sa simula ng bawat session — kung count = 3, mag-escalate agad.
