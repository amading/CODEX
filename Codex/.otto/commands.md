# OTTO Slash Commands

Use these commands in chat to quickly route work to the right agent.

## Commands

| Command | Agent | Purpose |
| --- | --- | --- |
| `/project` | Master Orchestrator Agent | Select or create active project folder |
| `/model` | Model Router Agent | Auto-select or explain model/tool routing |
| `/createproject` | Project Creator Agent | Create a full project from request |
| `/upgradeproject` | Project Upgrade Agent | Upgrade active project safely |
| `/lockproject` | Project Lock Agent | Lock active project to prevent wrong edits |
| `/approval` | Approval Gate Agent | Set approval mode |
| `/upgradeagents` | Agent Upgrade Advisor | Suggest safe upgrades for all OTTO agents |
| `/post` | GET/POST Endpoint Agent | Create POST endpoint and suggested commit message |
| `/get` | GET/POST Endpoint Agent | Create GET endpoint and suggested commit message |
| `/api` | GET/POST Endpoint Agent | Create GET/POST API routes |
| `/config` | API Config Agent | Create `.ini`, `.env.example`, JSON, or YAML config |
| `/code` | Fullstack Development Agent | Create or edit backend/frontend code |
| `/run` | Run & Fix Agent | Run active project, detect errors, and fix safe issues |
| `/autorun` | Auto Run Agent | Auto-run safe checks after code changes |
| `/ui` | UI/UX Agent | Create UI screen/component/layout |
| `/db` | Database Agent | Safe readonly SQL/schema/query work |
| `/createdb` | Database Creator Agent | Create schema/migrations/seed templates |
| `/lookupproduct` | Web Scraper / Backend Fetch Agent | Lookup product by barcode/name and return structured hints |
| `/debug` | Debug & QA Agent | Debug error/log/test failure |
| `/runfix` | Run & Fix Agent | Run checks and fix project errors after approval |
| `/terminal` | Terminal Runner Agent | Run approved terminal command |
| `/install` | Package Installer Agent | Install approved package |
| `/test` | Run/Test Agent | Run tests/build/lint checks |
| `/finalize` | Master Orchestrator Agent | Check project, fix issues, document how it was made |
| `/complete` | Completeness Agent | Check if the project has missing requirements or parts |
| `/review` | Final Review Agent | Senior final project review |
| `/expert` | Master Orchestrator Agent | Use global OTTO Expert Mode for the active project |
| `/auditdeps` | Dependency Audit Agent | Audit dependencies |
| `/server` | Local Server Agent | Start/check local dev server |
| `/recover` | Recovery Agent | Recover stuck or broken workflow |
| `/short` | Output Control Agent | Clean noisy output into short final answer |
| `/deploy` | Automation & Deployment Agent | Docker/VPS/deployment workflow |
| `/docs` | Documentation Agent | README, Tagalog guide, tutorial |
| `/comment` | Code Comment Agent | Add short Tagalog comments to project code |
| `/notes` | Documentation Agent + Code Comment Agent | Create Tagalog project guide and important code comments |
| `/report` | Analytics & Reports Agent | Dashboard, chart, PDF/Excel report |
| `/fast` | Fast Utility Agent | Simple cheap task |
| `/lowcost` | Model Router Agent | Use low-cost auto mode |

## Command Rules

- Every command goes through Master Orchestrator first.
- Approval Gate Agent checks permission before creating/changing data.
- If a command was proposed and the user replies `confirm`, run only that approved command.
- Every command must include a suggested commit message when files change.
- `/post` and `/get` must validate inputs and avoid secret exposure.
- `/db` is readonly by default.
- No command may read or expose `.env`.

## `/project` Format

```text
/project <project-name>
```

Example:

```text
/project inventory-app
```

This selects or creates:

```text
.otto/projects/inventory-app/
```

Files inside:

```text
project.md
tasks.md
decisions.md
notes.md
```

Do not store secrets in project folders.

`/project` also locks the active project. Agents must continue work inside that project unless the user switches project.

## `/run` Format

```text
/run
```

Runs/checks the active project. If something is wrong, Run & Fix Agent fixes safe issues and asks approval before installs, server start, deployment, deletes, or risky commands.

## `/notes` Format

```text
/notes
```

Creates or updates:

- Tagalog project guide
- file-by-file manual edit guide
- important Tagalog code comments
- run/check instructions

Do not comment every line. Comment important sections only.

## `/approval` Format

```text
/approval ask-first
/approval auto-approve-safe
/approval manual-only
```

Default:

```text
/approval ask-first
```

`auto-approve-safe` still asks before database writes, `.env`, secrets, deployment, deletes, installs, or risky commands.

## `/post` Format

```text
/post resource=<name> fields=<field1,field2> auth=<yes/no>
```

Example:

```text
/post resource=orders fields=customer_id,total,status auth=yes
```

Expected output:

- Created route
- Validation rules
- Request example
- Response example
- Tests/checks
- Suggested commit message

## Commit Rule

When a command changes files, output:

```text
Commit message:
<type>: <short summary>
```
