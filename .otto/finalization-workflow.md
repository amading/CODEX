# OTTO Finalization Workflow

Use this before saying a project or feature is done.

## Required Final Flow

1. **Project Lock Agent** — confirm the active project path is correct.
2. **Requirement Trace Agent** — list all REQ-### IDs and confirm their current status.
3. **Checklist Agent** — confirm checklist status: ✅ done / ❌ missing / 🔒 blocked.
4. **Gap Detection Agent** — find any requirement that is missing or incomplete; assign gaps to the right agent.
5. **Run/Test Agent** — run all available checks: lint → typecheck → unit tests → build. Report pass/fail clearly.
6. **Auto Run Agent** — trigger safe post-code-change checks automatically.
7. **Debug & QA Agent** — fix all detected issues. Use 5 Whys for root cause. Do not mark fixed without proof.
8. **Security Agent** — check OWASP Top 10, secrets, `.env`, database safety, risky code. Rate every finding. Block on critical.
9. **Completeness Agent** — verify every requirement is implemented AND working, not just filed.
10. **Final Review Agent** — senior inspection: request vs. actual files, residual risks, approve or block.
11. **Code Comment Agent** — add short Tagalog inline comments to every changed custom code file.
12. **Output Control Agent** — compress final response: remove repeated text, keep only useful result.
13. **Documentation Agent** — write project guide: setup, run, test, deploy, Tagalog notes, commit message.
14. **Memory & Learning Agent** — log any new lessons and prevention rules from this task.

## Documentation Required After Build

Documentation Agent must create or update project docs with:

- how the program was made
- file-by-file guide
- section/line guide for manual editing
- how to run
- how to test/check
- how to manually edit
- Tagalog notes
- security notes
- editable notes for every changed file
- commit message

## Done Rule

Do not say `done` until ALL of these are true:

- [ ] Active project path confirmed by Project Lock Agent
- [ ] All REQ-### requirements verified by Requirement Trace Agent
- [ ] Checklist complete — no ❌ items remain
- [ ] No critical or high gaps remain from Gap Detection Agent
- [ ] All available tests/checks passed (lint, build, unit tests)
- [ ] All errors fixed or reported with clear reason why they cannot be fixed
- [ ] Security Agent confirmed no critical or high findings
- [ ] Completeness Agent confirmed all requirements are working, not just coded
- [ ] Final Review Agent approved (not just reviewed)
- [ ] Tagalog inline comments added to every changed custom code file
- [ ] Project notes include file-by-file manual edit guide
- [ ] Documentation updated with setup, run, test, and commit message
- [ ] Memory & Learning Agent recorded any new lessons

## Confidence Gate

Before saying done, the Final Review Agent must rate confidence: High / Medium / Low.
- High: proceed and say done.
- Medium: list remaining risks clearly, then say done.
- Low: do not say done — return to Debug & QA Agent.

## If Checks Cannot Run

Name the exact check that could not run, the reason it could not run, and what manual verification the user can do instead.
