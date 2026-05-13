# OTTO Mistakes And Lessons

Format: **Mistake → Cause → Prevention Rule**

Use this file to prevent repeated errors across all agents.
Memory & Learning Agent must update this file after every repeated or important mistake.
Agent Upgrade Advisor must review this file to suggest agent rule improvements.

---

## 🔴 Critical — Never Do Again

### M-001 — Exposed `.env` or Secrets
- **Mistake:** Agent read, printed, or summarized `.env` contents or API keys.
- **Cause:** No hard stop before reading secret files.
- **Prevention:** Treat `.env` as permanently blocked. Redact automatically. Never print. Stop work and notify Security Agent if a secret is found in output.

### M-002 — Destructive Database Command Without Approval
- **Mistake:** Agent ran `DROP`, `DELETE`, `TRUNCATE`, or unsafe `UPDATE` without explicit user approval.
- **Cause:** No readonly enforcement gate before running SQL.
- **Prevention:** Default all database access to readonly. Allowed: `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`. Block all others unless user types `confirm` for that specific command.

### M-003 — Edited the Wrong Project
- **Mistake:** Agent made changes in a different project folder than the one the user intended.
- **Cause:** Did not read `.otto/active-project.md` before acting. Assumed the nested app folder was the only project.
- **Prevention:** Always read `.otto/active-project.md` first. Use outer workspace root to find all sibling projects. Ask before switching projects.

### M-004 — Said "Done" Without Verification
- **Mistake:** Agent claimed the task was complete without running any check or showing file-level evidence.
- **Cause:** Skipped finalization workflow.
- **Prevention:** Never say done until: files exist, checks ran, security cleared, notes updated, commit message written. Use the finalization checklist in `finalization-workflow.md`.

### M-005 — OTTO Agent File Changed Without Password
- **Mistake:** An agent edited or attempted to edit a protected `.otto/agents/` file without the user providing the agent-update password.
- **Cause:** Skipped the protection policy check.
- **Prevention:** Always check `agent-protection-policy.md` before touching any `.otto/agents/` file. Stop immediately if no password was given for that request.

---

## 🟠 High Priority — Avoid Every Task

### M-006 — Guessed Instead of Asking
- **Mistake:** Agent built the wrong feature because the request was ambiguous and agent assumed instead of clarifying.
- **Cause:** No "ask before guessing" rule enforced.
- **Prevention:** If the request is unclear, ask one short clarifying question before writing any code. Do not guess on features that affect data, UI, or user flow.

### M-007 — Repeated the Same Plan Without Acting
- **Mistake:** Agent kept restating the plan in different words without actually doing the work.
- **Cause:** No loop detection. No "act, don't plan" enforcement.
- **Prevention:** If the same plan is stated twice, stop and route to Loop Guard Agent. Switch from planning to action immediately.

### M-008 — Showed Internal Planning Text to User
- **Mistake:** Agent included internal reasoning, agent handoff notes, or planning steps in the final user-facing response.
- **Cause:** Output Control Agent not applied before final answer.
- **Prevention:** Run Output Control Agent on every final answer. Remove planning text, repeated sentences, and internal notes. User sees only: result, files changed, checks done, next step.

### M-009 — Assumed Model Switching Was Automatic
- **Mistake:** Agent told the user a model was switched when the platform does not support automatic model switching.
- **Cause:** Confused routing instructions with actual runtime behavior.
- **Prevention:** `model-routing.json` and agent files are routing guides, not auto-switches. Real switching requires platform support (Auto mode, OpenCode, LiteLLM, OpenRouter, API router). Always state the active model clearly.

### M-010 — Skipped Security Check Before Final Output
- **Mistake:** Final output was delivered without Security Agent reviewing for secrets, injection risks, or unsafe code.
- **Cause:** Security Agent not included in finalization workflow.
- **Prevention:** Security Agent is required in every finalization. Check OWASP Top 10, secrets, permissions, and unsafe SQL before saying done.

### M-011 — Created Too Many Agents for a Simple Task
- **Mistake:** Agent spawned or called many sub-agents for work that could be done by one cheap agent.
- **Cause:** No cost-check before agent assignment.
- **Prevention:** Use Model Router Agent first. Start with cheap profile. Escalate only when the current profile has failed or is clearly insufficient.

### M-012 — Wrote Long Answer When User Wants Short
- **Mistake:** Agent produced a wall-of-text response when the user asked for a short answer.
- **Cause:** Output Control Agent not applied.
- **Prevention:** When user says "short," "brief," or "just do it," compress to under 10 lines. No repeated paragraphs. No summaries of summaries.

---

## 🟡 Medium Priority — Watch and Prevent

### M-013 — Comments Left in English for Tagalog Project
- **Mistake:** Important custom code comments were written in English when user prefers Tagalog.
- **Cause:** Code Comment Agent not run after coding was complete.
- **Prevention:** After every coding task, route to Code Comment Agent. Convert important custom code comments to Tagalog. Only comment important sections, not every line.

### M-014 — Misread Ambiguous User Request
- **Mistake:** Agent assumed "tic toc" meant a timer app. User intended a Tik Tok beat-tapping game.
- **Cause:** Did not clarify before building.
- **Prevention:** When a request uses slang, short names, or could mean multiple things, ask one clarifying question first. Do not build until the purpose is confirmed.

### M-015 — Migration Written Without Rollback
- **Mistake:** Database migration file was written without a matching rollback/reverse SQL.
- **Cause:** Database Agent did not enforce rollback requirement.
- **Prevention:** Every migration must include: forward SQL + rollback SQL. Never deliver a migration without both.

### M-016 — Fixed Bug Without Reproducing It First
- **Mistake:** Agent changed code to fix a bug it did not actually reproduce or confirm.
- **Cause:** Debug & QA Agent skipped reproduction step.
- **Prevention:** Reproduce the bug first. Never fix what you cannot confirm exists. Use 5 Whys to find root cause before changing code.

### M-017 — UI Built Without Testing Empty and Error States
- **Mistake:** UI was built and shown as complete but had no empty state, error state, or overflow handling.
- **Cause:** UI/UX Agent only tested the happy path.
- **Prevention:** Always test: empty data, loading, error, success, long text overflow, and mobile layout. Mark these states clearly in the output.

### M-018 — Package Installed Without Checking Existing Dependencies
- **Mistake:** Agent installed a new package that duplicated functionality already available in the project.
- **Cause:** Package Installer Agent did not read existing `package.json` or `composer.json` first.
- **Prevention:** Always read existing dependencies before recommending a new package. Ask: does the project already solve this?

### M-019 — Deployment Config Included Hardcoded Secrets
- **Mistake:** Deployment file (Dockerfile, CI/CD) contained hardcoded passwords or API keys.
- **Cause:** Automation & Deployment Agent did not run Security Agent review before output.
- **Prevention:** All deployment configs must use environment variable references only. No real values. Security Agent reviews before final output.

### M-020 — Requirement Not Traced Before Building
- **Mistake:** Feature was built without assigning a REQ-### ID, making it impossible to verify completeness.
- **Cause:** Requirement Trace Agent skipped.
- **Prevention:** Every feature request gets a REQ-### ID before any code is written. Use these IDs in the checklist and gap detection.

---

## 🟢 Low Priority — Good to Know

### M-021 — Notes Not Updated After Code Change
- **Mistake:** Code was changed but project `notes.md`, `tasks.md`, or `decisions.md` were not updated.
- **Cause:** Documentation Agent not run after task.
- **Prevention:** After every important code change, update project notes with: what changed, which file, what the user can edit manually.

### M-022 — Agent Messages Left Stale
- **Mistake:** `.otto/agent-messages.md` still had old "blocked" messages that were already resolved.
- **Cause:** Reporter Agent did not close resolved messages.
- **Prevention:** When a blocker is resolved, update its status to `resolved` or `closed` in `agent-messages.md`.

### M-023 — Wrong Claude Model Used for Task Weight
- **Mistake:** A cheap model (haiku) was used for a security review or complex architecture task.
- **Cause:** Model Router Agent did not escalate based on task weight.
- **Prevention:** Security, database, architecture, and hard debugging always escalate to `claude-sonnet-4-6` minimum. Use `claude-opus-4-7` only for production-critical or deep reasoning tasks.

### M-024 — OpenCode Not Used for Free Backend Tasks
- **Mistake:** Agent used a paid model for backend file generation when OpenCode was available for free.
- **Cause:** Routing did not check for OpenCode availability first.
- **Prevention:** For backend file/code generation (routes, controllers, migrations, configs), check if OpenCode is available first. Use it for free before escalating to paid models.

---

## Pattern Watch

If any mistake appears 3 or more times, it must be escalated to Agent Upgrade Advisor for a rule change in the responsible agent file.

| Mistake ID | Times Seen | Status |
| --- | --- | --- |
| M-001 | 0 | Watching |
| M-002 | 0 | Watching |
| M-003 | 1 | Watching |
| M-007 | 1 | Watching |
| M-008 | 1 | Watching |
| M-013 | 1 | Watching |
| M-014 | 1 | Watching |

---

## How to Add a New Mistake

When Memory & Learning Agent records a new mistake, use this format:

```
### M-### — Short Title
- **Mistake:** What went wrong.
- **Cause:** Why it happened.
- **Prevention:** Exact rule to prevent it next time.
```

Add the new ID to the Pattern Watch table with count = 1.
If the same mistake already exists, increment its count.
If count reaches 3, flag to Agent Upgrade Advisor.

No secrets, passwords, tokens, or `.env` values may be stored in this file.
