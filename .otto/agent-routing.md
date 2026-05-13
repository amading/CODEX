# OTTO Agent Routing

Use this compact agent list for low-cost, provider-flexible work across Codex, Cursor, Claude, and OpenCode.

## Model Routing Policy

Use `.otto/model-routing.json` as the source of truth for model profiles.

| Profile | Use For | Codex/OpenAI | Cursor | Claude | OpenCode (Free) |
| --- | --- | --- | --- | --- | --- |
| cheap | Simple edits, summaries, routing, docs, quick commands | GPT-5 mini | Auto / cheapest fast model | Claude Haiku | Free local model |
| standard | Normal coding, small features, tests, refactors | GPT-5 mini or GPT-5 when needed | Auto | Claude Sonnet | Free backend code generation |
| strong | Backend, database, security, analytics, architecture, hard debugging | GPT-5 | Max / strongest coding mode | Claude Sonnet or Opus | **Preferred free backend tool** |
| deep | High-risk architecture, security review, production incidents | GPT-5.5 high reasoning | Max / strongest reasoning mode | Claude Opus | Strongest model available |
| visual | Screenshots, UI inspection, OCR, image understanding, visual design | GPT-4o | Visual-capable model | Claude Sonnet visual | Not recommended |
| tool | File generation, repo automation, local tooling | codex-mini-latest | Cursor agent tools | Claude tool-use | **Primary free tool** |

If a platform cannot switch models automatically, simulate the routing by using the cheapest available model and manually escalate only when needed.

| Agent | Model | Purpose |
| --- | --- | --- |
| Master Orchestrator Agent | cheap | Controls workflow, assigns tasks, switches models |
| Model Router Agent | cheap | Auto-selects cheapest useful model/tool and escalates when needed |
| Approval Gate Agent | cheap | Asks permission before creating/changing data or risky actions |
| Agent Upgrade Advisor | cheap | Suggests safe upgrades for OTTO agents |
| Project Creator Agent | cheap | Creates new project folders and starter files |
| Project Upgrade Agent | standard | Upgrades existing projects safely |
| Project Lock Agent | cheap | Prevents wrong-project edits |
| Fullstack Development Agent | standard + tool | Backend, frontend, APIs, file generation |
| Database Agent | strong | SQL optimization, readonly queries, database safety |
| Database Creator Agent | strong | Creates schemas, migrations, seed templates, ERD notes |
| Web Scraper / Backend Fetch Agent | standard | Fetches product hints from web/backend lookup sources |
| UI/UX Agent | visual | UI, mobile, layouts, responsive design |
| Debug & QA Agent | standard | Debugging, testing, validation, error fixing |
| Requirement Trace Agent | cheap | Tracks every user requirement as IDs |
| Checklist Agent | cheap | Creates complete project checklist |
| Gap Detection Agent | cheap | Finds missing modules/features |
| Completeness Agent | strong | Checks all program parts before final output |
| Final Review Agent | strong | Senior final project inspection |
| Loop Guard Agent | cheap | Detects repeated planning/output loops |
| Output Control Agent | cheap | Keeps final answers short and clean |
| Recovery Agent | standard | Recovers stuck or failed workflows |
| Reporter Agent | cheap | Reports blockers, repeated errors, and missing dependencies to Orchestrator |
| Run & Fix Agent | standard | Runs checks and fixes errors after approval |
| Auto Run Agent | cheap | Auto-runs safe checks after code changes |
| Terminal Runner Agent | cheap | Runs approved terminal commands |
| Package Installer Agent | cheap | Installs approved packages |
| Run/Test Agent | cheap | Runs tests/build/lint checks |
| Code Comment Agent | cheap | Adds short Tagalog comments to project code |
| Dependency Audit Agent | standard | Reviews dependency risk and bloat |
| Local Server Agent | cheap | Starts/checks local dev servers after approval |
| RAG & Vision Agent | visual | OCR, screenshots, documents, search |
| Security Agent | strong | Protects `.env`, secrets, database, permissions |
| Automation & Deployment Agent | standard | Bots, workflows, Docker, VPS, syncing |
| API Config Agent | cheap | Auto creates `.ini`/config files for project settings |
| GET/POST Endpoint Agent | standard | Creates GET/POST API routes from project config |
| Documentation Agent | cheap | README, Tagalog notes, tutorials, comments |
| Memory & Learning Agent | cheap | Learns mistakes, audit logs, retry prevention |
| Analytics & Reports Agent | strong | Dashboards, charts, PDF/Excel reports |
| Fast Utility Agent | cheap | Cheap/simple quick tasks |

## API Agents (agents/api/ — new dedicated folder)

| Agent | Model | Purpose |
| --- | --- | --- |
| API Builder Agent | strong | Build REST/GraphQL APIs — routes, controllers, services, validation |
| API Auth Agent | strong | JWT, OAuth2, API keys, sessions, RBAC — authentication and authorization |
| API Docs Agent | cheap | OpenAPI/Swagger, Postman collections, API README, Tagalog guide |
| API Tester Agent | strong | Automated tests for every endpoint — happy path, auth, validation, edge cases |
| API Integration Agent | strong | Third-party integrations — PayMongo, Stripe, Twilio, FCM, S3, Google OAuth |
| API Gateway Agent | cheap | Versioning, rate limiting, CORS, health check endpoint |
| API Mock Agent | cheap | Mock server, fixture data, fake responses for frontend/mobile dev |
| API Monitor Agent | cheap | Health checks, logging, uptime monitoring, error alerting |

## Hard Rules

- Never access or expose `.env`.
- Never expose API keys, tokens, passwords, or secrets.
- Database work is readonly by default.
- Allowed SQL: `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`.
- Block SQL: `DELETE`, `DROP`, `TRUNCATE`, unsafe `UPDATE`.
- Use the `cheap` profile first when possible to save cost.
- Use `standard`, `strong`, `deep`, `visual`, or `tool` only when the task requires it.
- Prefer the active workspace provider: Codex in Codex, Cursor in Cursor, Claude in Claude.
- If provider auto-switching is unavailable, keep the same agent workflow and manually choose the matching model profile.
- All agents must read latest 5 entries from `.otto/agent-messages.md` before acting.
- If same error repeats 2x, route to Reporter Agent and Recovery Agent immediately.
- Reporter Agent must append entries to `.otto/audit-log.md` and `.otto/mistakes.md`.
