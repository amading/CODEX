# OTTO Finalization Workflow — v2.0

Run this workflow in full before saying any project or feature is done.
No step may be skipped. If a step cannot run, it must be explicitly reported with a reason.
Reference: [agent-routing.md](agent-routing.md) | [agent-upgrade-checklist.md](agent-upgrade-checklist.md)

---

## Phase 0 — Pre-Finalization Setup (always first)

Run these in parallel before any other phase begins.

| Step | Agent | Action |
|------|-------|--------|
| 0.1 | Project Lock Agent | Confirm the active project folder from root `AGENTS.md`. Lock it. |
| 0.2 | Task Manager | List all subtasks: done / in-progress / pending / blocked. |
| 0.3 | Requirement Trace Agent | Pull every `REQ-###` ID from `tasks.md`. List status of each: `done / partial / missing`. |
| 0.4 | Retry Prevention Agent | Check `mistakes.md` — flag any Pattern Watch items relevant to this task. |

**Gate:** If any `REQ-###` is `missing` or any Pattern Watch item is flagged, resolve before Phase 1.

---

## Phase 1 — Gap Detection & Completeness

Run sequentially.

**Step 1.1 — Gap Detection Agent**
- Compare every `REQ-###` against actual implemented files.
- Assign each gap to the correct agent.
- Output: gap list with severity `critical / high / medium / low`.
- Block on critical or high gaps — do not advance to Phase 2 until resolved.

**Step 1.2 — Completeness Agent**
- Verify every requirement is implemented AND working — not just filed or coded.
- Check: does the feature behave correctly end-to-end?
- Check: are edge cases and error paths handled?
- Output: `complete / incomplete` verdict per REQ-###.

**Step 1.3 — Handoff to Phase 2**
Pass HANDOFF BLOCK:
```
from: Completeness Agent
to: Run/Test Agent
task_summary: <one line>
files_touched: [list]
decisions_made: [list]
open_questions: [list]
risk_flags: [list]
```

---

## Phase 2 — Testing & Validation

Run in this order. Stop on first failure and fix before continuing.

**Step 2.1 — Run/Test Agent**
Run all available checks in sequence:
1. Lint / syntax check
2. Type check (if applicable)
3. Unit tests
4. Integration tests
5. Build / compilation

Report for each: `PASS / FAIL / SKIP (reason)`.
Never continue to the next check when the current check fails.

**Step 2.2 — Auto Run Agent**
Trigger safe post-code-change checks automatically:
- PHP syntax validation on all changed `.php` files
- JS validation on all changed `.js` files
- HTML/CSS validation on all changed UI files

**Step 2.3 — Debug & QA Agent** (if any failure in 2.1 or 2.2)
- Use 5 Whys method for every root cause.
- Reproduce the bug before fixing it — never fix unconfirmed issues.
- Check adjacent code for the same class of bug after each fix.
- Do not mark fixed without proof (show output or file change).
- After all fixes, re-run Step 2.1 from the top.

**Gate:** All checks must be `PASS` or `SKIP (with documented reason)` before Phase 3.

---

## Phase 3 — Security Review

Run all security checks. Security Agent is always `strong` profile (Opus 4.7).

**Step 3.1 — Security Agent Full Review**
Check in this order:
1. OWASP Top 10 — all 10 items
2. SQL injection — every DB query
3. XSS — every output that renders user data
4. CSRF — every form and state-changing endpoint
5. Path traversal — every file operation
6. Auth & access control — every route and API endpoint
7. Rate limiting — every public endpoint
8. `.env` and secrets — confirm nothing is exposed
9. Hardcoded credentials — zero allowed
10. Deployment config — environment variable references only

**Step 3.2 — Rate every finding:**
- `critical` — block task entirely, resolve before anything continues
- `high` — block Phase 4, resolve before moving forward
- `medium` — document and flag for next sprint, do not block
- `low / info` — log only

**Step 3.3 — Guard Agent Confirmation**
Confirm all three are still active and have not been bypassed:
- [ ] Database Guard — active
- [ ] ENV Protection — active
- [ ] Secret Guard — active

**Step 3.4 — Log findings**
Write all findings to `audit-log.md` with: severity, file, line, description, resolution status.

**Gate:** Zero `critical` or `high` findings before Phase 4.

---

## Phase 4 — Final Review

**Step 4.1 — Final Review Agent** (strong profile — Opus 4.7)
Senior inspection:
- Compare the original request or `REQ-###` spec against actual changed files.
- Verify all Phase 1–3 gates passed.
- Check for residual risks not caught in earlier phases.
- Check for scope creep — flag anything built beyond what was requested.
- Assess: does the output actually solve the user's problem?

**Step 4.2 — Confidence Gate**
Final Review Agent must rate overall confidence before proceeding:

| Rating | Meaning | Action |
|--------|---------|--------|
| High | All gates passed, no open risks | Proceed to Phase 5 |
| Medium | Minor open items, risks documented | Proceed to Phase 5, risks listed in summary |
| Low | Significant gaps or unresolved issues | Return to Phase 2 or 3 — do NOT proceed |

**Gate:** Confidence must be `High` or `Medium` before Phase 5.

---

## Phase 5 — Documentation & Comments

Run Steps 5.1–5.3 in parallel.

**Step 5.1 — Code Comment Agent**
- Add short inline Tagalog comments to every changed custom code file.
- Add section markers to every major editable block.
- Add edit hints near fragile or non-obvious logic.
- Do not comment every line — only important sections.

**Step 5.2 — Documentation Agent**
Create or update project docs with all of the following:
- [ ] How the program/feature was built (brief)
- [ ] File-by-file guide (what each file does)
- [ ] Section/line guide for manual editing
- [ ] How to run / start
- [ ] How to test / validate
- [ ] How to manually edit safely
- [ ] What must NOT be changed
- [ ] Dependency notes
- [ ] Fallback behavior notes
- [ ] Security notes
- [ ] Tagalog notes (plain language explanation)
- [ ] Suggested git commit message

**Step 5.3 — Tagalog Notes Agent**
- Write a plain Tagalog explanation block for every piece of custom business logic.
- Keep it short — explain what it does and why, not how.

---

## Phase 6 — Memory, Audit & Commit

Run Steps 6.1–6.3 in parallel.

**Step 6.1 — Memory & Learning Agent**
Write entries for:
- Every architectural decision made during this task
- Every bug fix with a non-obvious cause
- Every security finding (even if resolved)
- Any new prevention rule derived from a mistake

Append to:
- `CODEX/.otto/memory/lessons.md`
- `CODEX/.otto/memory/decisions.md`
- `CODEX/.otto/memory/security-log.md` (if security findings exist)

**Step 6.2 — Audit Log Agent**
Update `audit-log.md` with:
- Task ID / REQ-### reference
- Date and active project
- Security findings and resolution status
- OpenCode usage (if any)
- Model escalations and justifications

**Step 6.3 — Commit Agent**
Generate the final git commit message:
```
<type>(<scope>): <short description>

- <change 1>
- <change 2>
- <change 3>

REQ-###: <requirement reference>
Security: <none | findings resolved>
Tested: <what was tested>
```

---

## Phase 7 — Output Control & Delivery

**Step 7.1 — Output Control Agent**
- Compress the final response — remove repeated text.
- Keep only: summary, file list, security notes, Tagalog notes, commit message, manual edit guide.
- If output is over 500 lines, Summarizer condenses it first.

**Step 7.2 — Final Delivery**
Deliver the standard 7-section dev summary:
```
## Dev Summary
1. Files changed (full paths)
2. What was tested and how (pass/fail/skip)
3. Security review notes (findings + severities)
4. Tagalog notes
5. Suggested git commit message
6. Manual edit guide (file-by-file)
7. Next steps (if anything remains incomplete)
```

---

## Done Rule — Full Gate

Do not say `done` until every box below is checked:

### Phase 0–1
- [ ] Active project path confirmed and locked
- [ ] All `REQ-###` IDs listed and verified
- [ ] No `critical` or `high` gaps from Gap Detection Agent
- [ ] All `REQ-###` requirements confirmed working (not just coded)

### Phase 2
- [ ] All lint/typecheck/test/build checks: `PASS` or `SKIP (documented)`
- [ ] All errors fixed or reported with a clear reason why they cannot be fixed
- [ ] Bug reproduction confirmed before fix
- [ ] Adjacent code checked for the same class of bug

### Phase 3
- [ ] OWASP Top 10 checked
- [ ] Zero `critical` or `high` security findings open
- [ ] All findings logged in `audit-log.md`
- [ ] Database Guard, ENV Protection, Secret Guard all confirmed active
- [ ] No secrets, tokens, or `.env` contents in any output

### Phase 4
- [ ] Final Review Agent approved (not just reviewed)
- [ ] Confidence Gate is `High` or `Medium`
- [ ] No unresolved scope creep

### Phase 5
- [ ] Tagalog inline comments added to every changed custom code file
- [ ] File-by-file manual edit guide written
- [ ] Documentation updated: setup, run, test, deploy, commit message
- [ ] Tagalog notes written for all custom business logic

### Phase 6
- [ ] Memory & Learning Agent entries written
- [ ] `audit-log.md` updated
- [ ] Git commit message generated

### Phase 7
- [ ] Dev summary delivered in standard 7-section format
- [ ] Output compressed — no repeated or unnecessary content

---

## If a Step Cannot Run

Report all three:
1. **Which step** could not run (step number and agent name)
2. **Why** it could not run (specific reason — not "unknown")
3. **What manual verification** the user can do instead

Do not skip silently. Do not estimate a passing result for a skipped check.

---

## Rollback Decision Point

If at any point during Phases 1–3 a `critical` finding cannot be resolved:

1. Stop all further phases immediately.
2. Document the exact blocker in `audit-log.md`.
3. Provide rollback instructions: which files to revert and how.
4. Notify the user with: blocker description, severity, recommended action.
5. Do not deliver a partial done summary.

---

## Tagalog Notes

Ang finalization workflow na ito ay dapat sundin ng buo bago sabihing "tapos na."
Walang phase ang maaaring laktawan — kung hindi maaaring patakbuhin ang isang step,
kailangang ipaliwanag kung bakit at kung ano ang manual na paraan para ma-verify.

Ang Confidence Gate ay kailangan ng High o Medium bago mag-proceed sa Phase 5.
Kung Low ang rating ng Final Review Agent, bumalik sa Phase 2 o 3 — huwag ituloy.

Ang lahat ng security findings ay kailangang may severity rating.
Ang critical at high findings ay nagba-block ng progress — hindi maaaring ituloy ang gawain.
Ang lahat ng natuklasang pagkakamali ay isusulat sa memory folder para sa susunod na sessions.
