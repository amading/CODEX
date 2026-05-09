# OTTO Agent Routing

Use this compact agent list for low-cost Codex/OpenCode work.

| Agent | Model | Purpose |
| --- | --- | --- |
| Master Orchestrator Agent | GPT-5 mini | Controls workflow, assigns tasks, switches models |
| Model Router Agent | GPT-5 mini | Auto-selects cheapest useful model/tool and escalates when needed |
| Approval Gate Agent | GPT-5 mini | Asks permission before creating/changing data or risky actions |
| Agent Upgrade Advisor | GPT-5 mini | Suggests safe upgrades for OTTO agents |
| Project Creator Agent | GPT-5 mini | Creates new project folders and starter files |
| Project Upgrade Agent | GPT-5 mini | Upgrades existing projects safely |
| Project Lock Agent | GPT-5 mini | Prevents wrong-project edits |
| Fullstack Development Agent | GPT-5 + OpenCode | Backend, frontend, APIs, file generation |
| Database Agent | GPT-5 | SQL optimization, readonly queries, database safety |
| Database Creator Agent | GPT-5 | Creates schemas, migrations, seed templates, ERD notes |
| Web Scraper / Backend Fetch Agent | GPT-5 | Fetches product hints from web/backend lookup sources |
| UI/UX Agent | Gemini Free / GPT-4o / Kombai | UI, mobile, layouts, responsive design |
| Debug & QA Agent | GPT-5 mini | Debugging, testing, validation, error fixing |
| Requirement Trace Agent | GPT-5 mini | Tracks every user requirement as IDs |
| Checklist Agent | GPT-5 mini | Creates complete project checklist |
| Gap Detection Agent | GPT-5 mini | Finds missing modules/features |
| Completeness Agent | GPT-5 | Checks all program parts before final output |
| Final Review Agent | GPT-5 | Senior final project inspection |
| Loop Guard Agent | GPT-5 mini | Detects repeated planning/output loops |
| Output Control Agent | GPT-5 mini | Keeps final answers short and clean |
| Recovery Agent | GPT-5 mini | Recovers stuck or failed workflows |
| Reporter Agent | GPT-5 mini | Reports blockers, repeated errors, and missing dependencies to Orchestrator |
| Run & Fix Agent | GPT-5 mini | Runs checks and fixes errors after approval |
| Auto Run Agent | GPT-5 mini | Auto-runs safe checks after code changes |
| Terminal Runner Agent | GPT-5 mini | Runs approved terminal commands |
| Package Installer Agent | GPT-5 mini | Installs approved packages |
| Run/Test Agent | GPT-5 mini | Runs tests/build/lint checks |
| Code Comment Agent | GPT-5 mini | Adds short Tagalog comments to project code |
| Dependency Audit Agent | GPT-5 mini | Reviews dependency risk and bloat |
| Local Server Agent | GPT-5 mini | Starts/checks local dev servers after approval |
| RAG & Vision Agent | GPT-4o + GPT-5 mini | OCR, screenshots, documents, search |
| Security Agent | GPT-5 mini | Protects `.env`, secrets, database, permissions |
| Automation & Deployment Agent | GPT-5 mini | Bots, workflows, Docker, VPS, syncing |
| API Config Agent | GPT-5 mini | Auto creates `.ini`/config files for project settings |
| GET/POST Endpoint Agent | GPT-5 | Creates GET/POST API routes from project config |
| Documentation Agent | GPT-5 mini | README, Tagalog notes, tutorials, comments |
| Memory & Learning Agent | GPT-5 mini | Learns mistakes, audit logs, retry prevention |
| Analytics & Reports Agent | GPT-5 | Dashboards, charts, PDF/Excel reports |
| Fast Utility Agent | GPT-5 mini | Cheap/simple quick tasks |

## Hard Rules

- Never access or expose `.env`.
- Never expose API keys, tokens, passwords, or secrets.
- Database work is readonly by default.
- Allowed SQL: `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`.
- Block SQL: `DELETE`, `DROP`, `TRUNCATE`, unsafe `UPDATE`.
- Use GPT-5 mini first when possible to save cost.
- All agents must read latest 5 entries from `.otto/agent-messages.md` before acting.
- If same error repeats 2x, route to Reporter Agent and Recovery Agent immediately.
- Reporter Agent must append entries to `.otto/audit-log.md` and `.otto/mistakes.md`.
