# OTTO Decision Log

Use this file for important project decisions.

## Decisions

### 2026-05-13 — Claude Model Integration

- **Decision:** Add `Claude Model:` field to all 40 OTTO agent files instead of replacing GPT model fields.
- **Reason:** User requested Claude models be added without deleting existing OpenAI model references, keeping the system compatible with both providers.
- **Claude Model Mapping:** GPT-5 mini → `claude-haiku-4-5` (cheap), GPT-5 → `claude-sonnet-4-6` (strong).
- **Result:** All agents now have both GPT and Claude model references. `model-routing.json` updated with full Claude model IDs.

### 2026-05-13 — Agent Strength Upgrade

- **Decision:** Upgrade all 40 agent Super Agent Mode sections and rule sets with stronger, step-by-step protocols.
- **Reason:** User requested agents be smarter and more helpful — vague rules replaced with numbered reasoning steps.
- **Key changes:** OWASP Top 10 for Security, 5 Whys for Debug, rollback-required for DB, mobile-first for UI/UX, risk rating scale for Approval Gate.
- **Result:** All agents now think step by step, validate their own output, and escalate correctly.

### 2026-05-13 — OpenCode Not Required

- **Decision:** Confirmed that OTTO agents work with Claude Code without installing OpenCode.
- **Reason:** OTTO `.otto/agents/*.md` files are plain text instruction documents readable by any AI tool.
- **Result:** Claude Code is the active AI runtime for this workspace.
