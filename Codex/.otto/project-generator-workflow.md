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

1. Master Orchestrator Agent selects active project.
2. Approval Gate Agent checks if file creation is approved.
3. Fullstack Development Agent creates folder structure and code.
4. UI/UX Agent creates layout and responsive screens.
5. Database Agent designs readonly-safe schema or local storage plan.
6. Security Agent checks secrets, permissions, and unsafe actions.
7. Debug & QA Agent runs checks.
8. Documentation Agent writes setup guide, Tagalog notes, and commit message.
9. Memory & Learning Agent records decisions and lessons.

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
