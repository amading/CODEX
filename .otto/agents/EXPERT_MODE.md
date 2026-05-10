# OTTO Expert Mode

All OTTO agents must follow this file during project work.

## Main Expert Rules

- Use the active project lock before editing.
- Use the cheapest correct model first.
- Do not call every agent for every task.
- Prefer working code over explanation, but never skip verification.
- Check files before saying done.
- Run safe checks after code changes when possible.
- Ask before installs, server starts, deployment, database writes, deletes, or risky commands.
- Do not guess when the repo can answer the question.
- When a task is unclear, state the assumption and keep it minimal.
- Never read or expose `.env`.
- Never expose secrets, API keys, tokens, passwords, or private keys.
- Keep final answers short.
- Add Tagalog notes for important changes.
- Add Tagalog code comments for important custom code sections.
- Log repeated mistakes in `.otto/mistakes.md`.
- Use the strongest needed agent when the task affects security, data integrity, correctness, or production behavior.
- Block finalization until evidence is available or the missing check is clearly named.

## Expert Flow For Coding

1. Project Lock Agent verifies active project.
2. Requirement Trace Agent records requirements.
3. Checklist Agent creates the checklist.
4. Fullstack Development Agent or UI/UX Agent edits code.
5. Gap Detection Agent checks missing parts.
6. Code Comment Agent adds important Tagalog comments.
7. Auto Run Agent triggers safe checks.
8. Run/Test Agent checks files/tests/build when available.
9. Run & Fix Agent fixes safe issues.
10. Security Agent checks risks.
11. Completeness Agent blocks final output if required parts are missing.
12. Final Review Agent performs senior review.
13. Documentation Agent writes guide, change summary, and commit message.
14. Memory & Learning Agent records lessons.

## Stronger Execution Rules

- If a bug repeats, switch from Debug & QA to Recovery plus Reporter immediately.
- If a fix touches auth, data, permissions, or deployment, require Security Agent review.
- If the task touches user-visible flows, require Debug & QA and Final Review before done.
- If the task creates a new integration, require a checklist plus completeness pass.
- If the task is risky or production-facing, prefer a stronger agent over a cheaper one.
- If output is weak, incomplete, or circular, stop and reroute rather than polishing the same mistake.

## Expert Flow For UI

1. UI/UX Agent creates modern, responsive, editable UI.
2. Fullstack Development Agent implements files.
3. Code Comment Agent adds Tagalog section comments.
4. Auto Run Agent triggers safe checks.
5. Documentation Agent writes manual edit guide.

## Expert Flow For Backend

1. Fullstack Development Agent creates backend code.
2. Database Creator Agent creates schemas/migrations only when needed.
3. Web Scraper / Backend Fetch Agent handles product lookup enrichment when required.
4. Database Agent checks SQL safety/performance.
5. Security Agent checks auth, secrets, validation, and unsafe commands.
6. Run/Test Agent checks build/tests when available.

## Expert Flow For Terminal

- Terminal Runner Agent runs only approved commands.
- Package Installer Agent asks before installs.
- Local Server Agent asks before starting servers.
- If user says `confirm`, approve only the last requested command/action.

## Done Checklist

Do not say done until:

- active project confirmed
- changed files known
- safe checks run or reason given
- errors fixed or reported
- security reviewed
- completeness reviewed
- final senior review passed
- Tagalog notes/comments handled when needed
- commit message provided
- any skipped check is named with a reason
