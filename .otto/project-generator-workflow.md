# OTTO End-To-End Project Generator Workflow

Use this when the user wants a full project created from an idea.

## User Request Format

```text
Create project: <project-name>
Type: <web app / API / dashboard / POS / ecommerce / mobile / automation>
Stack: <optional>
Features: <feature list>
```

Example:

```text
Create project: pos-web
Type: POS web app
Stack: HTML CSS JS
Features: products, cart, checkout, receipt, sales report
```

## Auto Agent Flow

1. **Master Orchestrator Agent** — summarize the request in one line, confirm understanding, build a step plan.
2. **Approval Gate Agent** — rate risk of file creation (medium), ask for approval in `ask-first` mode.
3. **Requirement Trace Agent** — convert every feature into REQ-### IDs before any code is written.
4. **Project Creator Agent** — create project folder, `project.md`, `tasks.md`, `decisions.md`, `notes.md`.
5. **Fullstack Development Agent** — read project structure first, then create working code with clean folder layout.
6. **UI/UX Agent** — create responsive screens mobile-first; check all states (empty, error, success).
7. **Database Agent** — design readonly-safe schema; write migration + rollback SQL; suggest indexes.
8. **Security Agent** — check OWASP Top 10, secrets, permissions, unsafe actions. Block on critical.
9. **Debug & QA Agent** — run checks, use 5 Whys on failures, verify every fix with a check.
10. **Completeness Agent** — verify every REQ-### requirement is working, not just coded.
11. **Code Comment Agent** — add short Tagalog inline comments to every important changed file.
12. **Documentation Agent** — write setup guide, Tagalog notes, file-by-file manual edit guide, commit message.
13. **Memory & Learning Agent** — record decisions, lessons, and any prevention rules.

## Output Required

- Project folder
- Working code
- Setup guide
- Tagalog manual edit guide
- Test/check result
- Security notes
- Commit message

## Safety

- Do not read `.env`.
- Do not expose secrets.
- Ask before package installs.
- Ask before database writes.
- Ask before deployment.
