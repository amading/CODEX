# OTTO Agent Upgrade Suggestions

Use this file for proposed improvements before changing protected agent files.
Agent Upgrade Advisor writes here. User approves before changes are applied.

---

## Pending Suggestions

- None currently pending. All suggestions from 2026-05-13 have been approved and applied.

---

## Approved Suggestions

### 2026-05-13 — Claude Model Integration (Applied)
- **Agent:** All 40 agents
- **Suggestion:** Add `Claude Model:` field to every agent file so Claude Code knows which model to use.
- **Mapping:** GPT-5 mini → `claude-haiku-4-5` | GPT-5 → `claude-sonnet-4-6`
- **Status:** ✅ Applied

### 2026-05-13 — OpenCode Free Backend Support (Applied)
- **Agent:** All 9 backend agents
- **Suggestion:** Add `OpenCode:` field to every backend agent specifying what free task OpenCode handles.
- **Reason:** OpenCode is free and ideal for backend file/code generation tasks.
- **Status:** ✅ Applied

### 2026-05-13 — Super Agent Mode Numbered Steps (Applied)
- **Agent:** All 40 agents
- **Suggestion:** Rewrite all Super Agent Mode sections as numbered step-by-step protocols instead of loose bullet lists.
- **Reason:** Numbered steps force sequential reasoning and prevent skipping critical actions.
- **Status:** ✅ Applied

### 2026-05-13 — Security Agent OWASP Top 10 (Applied)
- **Agent:** Security Agent
- **Suggestion:** Add OWASP Top 10 checklist and severity rating (critical/high/medium/low/info) to Security Agent rules.
- **Reason:** Vague "check security" rule was too weak — agents need specific threat categories.
- **Status:** ✅ Applied

### 2026-05-13 — Debug Agent 5 Whys Protocol (Applied)
- **Agent:** Debug & QA Agent
- **Suggestion:** Add "ask why at least 3 times before concluding root cause" and "check adjacent code after fixing" rules.
- **Reason:** Agents were fixing symptoms, not root causes, causing the same bug to reappear.
- **Status:** ✅ Applied

### 2026-05-13 — Database Agent Rollback Requirement (Applied)
- **Agent:** Database Agent + Database Creator Agent
- **Suggestion:** Every migration must include rollback SQL. N+1 query detection added.
- **Reason:** Migrations were being written without rollback plans, making fixes risky.
- **Status:** ✅ Applied

### 2026-05-13 — Approval Gate Risk Rating Scale (Applied)
- **Agent:** Approval Gate Agent
- **Suggestion:** Add risk rating scale: safe / low / medium / high / critical before deciding to ask.
- **Reason:** Old rules were binary (ask/don't ask) — needed a gradient for smarter auto-approval.
- **Status:** ✅ Applied

### 2026-05-13 — Finalization Confidence Gate (Applied)
- **File:** finalization-workflow.md
- **Suggestion:** Add Confidence Gate (High/Medium/Low) before Final Review Agent approves done.
- **Reason:** Agents were saying done even when review confidence was low.
- **Status:** ✅ Applied

### 2026-05-13 — mistakes.md Full Rebuild (Applied)
- **File:** mistakes.md
- **Suggestion:** Rewrite from 10 loose bullets to 24 numbered lessons with Mistake → Cause → Prevention Rule format, priority tiers, and Pattern Watch table.
- **Reason:** Old format was too weak to prevent repeated mistakes.
- **Status:** ✅ Applied

---

## Rejected Suggestions

- None

---

## How to Add a New Suggestion

```text
### YYYY-MM-DD — Short Title (Pending)
- **Agent:** Agent name or file
- **Suggestion:** What should be added or changed.
- **Reason:** Why this change reduces mistakes or improves output.
- **Status:** Pending
```

## Rules

- Do not store passwords or secrets.
- Do not apply changes to protected agent files without user approval.
- Keep suggestions short and actionable — one change per suggestion.
- Move to Approved only after user confirms.
- Move to Rejected with a short reason if declined.
