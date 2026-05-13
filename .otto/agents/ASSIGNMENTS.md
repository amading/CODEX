# OTTO Agent Assignments

The Master Orchestrator Agent uses this map to assign work.

## Assignment Flow

1. Master Orchestrator Agent reads the user request and writes a one-line task summary.
2. Model Router Agent selects the cheapest useful model/tool — justify any escalation.
3. Approval Gate Agent rates risk (safe/low/medium/high/critical) and checks if permission is needed.
4. Master Orchestrator Agent selects one primary agent from the map below.
5. Assigned primary agent performs the work — think step by step before acting.
6. Project Lock Agent confirms the active project before any file is touched.
7. Run/Test Agent checks files/tests/build when available — stop on failure.
8. Debug & QA Agent fixes or reports issues — use 5 Whys for root cause.
9. Reporter Agent logs blockers/repeated failures and escalates when needed.
10. Security Agent checks OWASP Top 10, secrets, `.env`, permissions, and database safety.
11. Code Comment Agent adds Tagalog comments to all custom changed files.
12. Documentation Agent writes how it was made, Tagalog guide, and commit message.
13. Memory & Learning Agent records mistakes or lessons in `mistakes.md`.

## Strength Rules

- Choose one primary agent first, then only the minimum support agents needed.
- Use stronger support agents when the task touches security, data integrity, deployment, or final acceptance.
- If the first pass is incomplete, escalate once instead of repeating the same weak route.
- If the task needs evidence, assign Run/Test, Debug & QA, or Security before final review.
- If the user asks for a safer or stronger result, bias toward completeness and review over speed.

## Agent Assignment Map

### Project & System
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Select / create project | Master Orchestrator Agent | Project Lock, Memory & Learning, Documentation |
| Model / tool routing | Model Router Agent | Master Orchestrator |
| Create new project | Project Creator Agent | Fullstack Development, UI/UX, Documentation |
| Upgrade existing project | Project Upgrade Agent | Project Lock, Fullstack Development, Debug & QA |
| Lock / check active project | Project Lock Agent | Master Orchestrator |
| Approval / permission check | Approval Gate Agent | Master Orchestrator, Security |
| Change OTTO agent files | Approval Gate Agent | Master Orchestrator, Security |
| Suggest agent upgrades | Agent Upgrade Advisor | Memory & Learning, Approval Gate |

### Backend — Web
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| New web app / full project | Fullstack Development Agent | UI/UX, Database, Security, Debug & QA, Documentation |
| Backend code (PHP, Python, Node, Go) | Fullstack Development Agent | Database, Security, Debug & QA |
| REST API / JSON API | Fullstack Development Agent | Database, Security, Debug & QA |
| GET / POST endpoints | GET/POST Endpoint Agent | Database, Security, Debug & QA |
| Auth / login / JWT / session | Fullstack Development Agent | Security, Database, Debug & QA |
| Project config / .ini / .env.example | API Config Agent | Security, Documentation |
| Deployment / Docker / VPS / CI-CD | Automation & Deployment Agent | Security, Documentation |
| Product web/backend lookup | Web Scraper / Backend Fetch Agent | RAG & Vision, Security, Documentation |

### Backend — Database
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| SQL query / schema review | Database Agent | Security, Debug & QA |
| Create tables / migrations / seeds | Database Creator Agent | Database, Security, Documentation |
| Database performance / indexing | Database Agent | Security, Debug & QA |

### API (Dedicated API Agents — new folder: agents/api/)
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Build REST / GraphQL API | API Builder Agent | API Auth, API Docs, API Tester, Security, Database |
| API authentication / JWT / OAuth | API Auth Agent | Security, Database, API Tester |
| API documentation / Swagger / Postman | API Docs Agent | Documentation, API Builder |
| API testing / endpoint tests | API Tester Agent | Debug & QA, Run/Test, Security |
| Third-party integration (PayMongo, Stripe, SMS, FCM, S3) | API Integration Agent | Security, API Tester, API Docs |
| API versioning / rate limiting / CORS / health check | API Gateway Agent | Security, Automation & Deployment |
| Mock API server / fixture data | API Mock Agent | API Tester, UI/UX, Fullstack Development |
| API health monitoring / logging / uptime | API Monitor Agent | Reporter, Debug & QA, Automation & Deployment |

### Frontend — Web
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| UI screen / layout / component | UI/UX Agent | Fullstack Development, Debug & QA, Documentation |
| Dashboard / chart / report / export | Analytics & Reports Agent | Database, UI/UX, Documentation |
| Screenshot / OCR / document search | RAG & Vision Agent | Documentation, Debug & QA |

### Mobile
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Flutter / Dart mobile app | Fullstack Development Agent | UI/UX, Database, Security, Debug & QA, Documentation |
| Swift / SwiftUI iOS app | Fullstack Development Agent | UI/UX, Security, Debug & QA, Documentation |
| Kotlin / Android app | Fullstack Development Agent | UI/UX, Database, Security, Debug & QA, Documentation |
| React Native app | Fullstack Development Agent | UI/UX, Database, Security, Debug & QA, Documentation |
| Mobile UI screens / components | UI/UX Agent | Fullstack Development, Debug & QA |
| Mobile API integration | Fullstack Development Agent | Database, Security, Debug & QA |
| Mobile push notifications | Fullstack Development Agent | Security, Debug & QA |
| Mobile barcode / QR / camera | RAG & Vision Agent | Fullstack Development, Security |
| Mobile local database (SQLite, Room, CoreData) | Database Agent | Fullstack Development, Security |
| Mobile deployment (App Store / Play Store) | Automation & Deployment Agent | Security, Documentation |

### Desktop
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Electron desktop app | Fullstack Development Agent | UI/UX, Security, Debug & QA, Documentation |
| C# / .NET / MAUI desktop app | Fullstack Development Agent | Database, Security, Debug & QA, Documentation |

### QA & Checks
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Bug / error / log / crash | Debug & QA Agent | Fullstack Development, Security |
| Requirement tracking | Requirement Trace Agent | Checklist, Completeness |
| Project checklist | Checklist Agent | Requirement Trace, Gap Detection |
| Gap detection / missing features | Gap Detection Agent | Completeness, Coding/UI/Database agents |
| Completeness review | Completeness Agent | Requirement Trace, Checklist, Gap Detection |
| Final senior review | Final Review Agent | Completeness, QA, Security, Documentation |
| Repeated output loop | Loop Guard Agent | Output Control, Recovery, Memory & Learning |
| Noisy / long final answer | Output Control Agent | Master Orchestrator |
| Stuck / broken workflow | Recovery Agent | Debug & QA, Memory & Learning |
| Report blocker / repeated failure | Reporter Agent | Master Orchestrator, Recovery, Loop Guard |

### Run & Terminal
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Run / test / fix project | Run & Fix Agent | Approval Gate, Debug & QA, Security |
| Auto-check after code changes | Auto Run Agent | Run/Test, Run & Fix, Project Lock |
| Run tests / build / lint | Run/Test Agent | Run & Fix, Debug & QA |
| Terminal command | Terminal Runner Agent | Approval Gate, Run & Fix |
| Install package | Package Installer Agent | Approval Gate, Security, Documentation |
| Local dev server | Local Server Agent | Approval Gate, Run & Fix |
| Dependency audit | Dependency Audit Agent | Security, Package Installer |

### Docs & Comments
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Tagalog code comments (any platform) | Code Comment Agent | Documentation, Debug & QA |
| README / tutorial / Tagalog guide | Documentation Agent | Memory & Learning |
| Tagalog project notes | Documentation Agent | Code Comment, Memory & Learning |

### Utility
| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Small / simple / quick task | Fast Utility Agent | Documentation if needed |
| Mistake / retry prevention | Memory & Learning Agent | Debug & QA, Documentation |

## Cost Rule

Use the cheap profile first when enough. Use the standard profile for normal coding and tests. Use the strong profile for complex backend, architecture, SQL, reports, security, or difficult debugging. Use the visual profile for screenshots, OCR, visual checking, or design-to-code work. Use the tool profile for file generation and automation.

## Quick Route Reference

| Task | Agent Chain |
| --- | --- |
| Web coding | Fullstack + Security + Debug & QA |
| Mobile coding | Fullstack + UI/UX + Security + Debug & QA |
| Full project (any platform) | Req Trace → Checklist → Fullstack/UI/DB → Gap → Completeness → Final Review |
| Build REST / GraphQL API | API Builder → API Auth → API Docs → API Tester → Security |
| API auth / JWT / OAuth2 | API Auth → Security → API Tester |
| API docs / Swagger | API Docs → Documentation |
| API testing | API Tester → Debug & QA |
| Third-party integration | API Integration → Security → API Tester |
| API versioning / rate limit | API Gateway → Security |
| Mock API server | API Mock → API Tester |
| API monitoring / health | API Monitor → Reporter |
| Run / fix | Run & Fix + Debug & QA + Approval Gate |
| After code changes | Auto Run → Run/Test → Debug & QA |
| After coding done | Code Comment → Documentation |
| Terminal command | Terminal Runner + Approval Gate |
| Package install | Package Installer + Security + Documentation |
| New project | Project Creator + Fullstack + Documentation |
| Config / API setup | API Config + GET/POST Endpoint + Security |
| UI / screens | UI/UX + Debug & QA |
| Database | Database + Security |
| Database creation | Database Creator + Database + Security |
| Stuck / looping | Loop Guard → Output Control → Recovery |
| Docs / notes | Documentation + Memory & Learning |
| Mobile Tagalog comments | Code Comment (auto-detects Swift/Kotlin/Dart/RN) |

## Strong Defaults

- For backend or API work: Fullstack Development Agent + Security Agent + Run/Test Agent.
- For database work: Database Agent or Database Creator Agent + Security Agent + Debug & QA.
- For UI work: UI/UX Agent + Debug & QA + Completeness Agent.
- For final acceptance: Completeness Agent + Final Review Agent + Security Agent when relevant.
- For repeated failure: Reporter Agent + Recovery Agent + Memory & Learning Agent.

## Upgrade Rule

Use each agent's `When To Use` and `Quality Checklist` sections before final output. This keeps agents stronger without adding noisy 1000-item rules.

Use `.otto/agents/SUPER_UPGRADE_500.md` only as a deep reference when a task needs extra rigor.

Use `.otto/finalization-workflow.md` before saying a project or feature is done.

After coding changes, run Code Comment Agent before Documentation Agent when the project contains custom source files.

Use `.otto/agents/EXPERT_MODE.md` for all project work.

Before final output, use Completeness Agent and Final Review Agent for project-level work.

Use `.otto/low-cost-auto-mode.md` as the default mode for all tasks.

## Agent Communication Rule

All agents communicate through:

- `.otto/task-board.md`
- `.otto/agent-messages.md`
- `.otto/decision-log.md`
- `.otto/audit-log.md`
- `.otto/mistakes.md`

Master Orchestrator controls the task board. Memory & Learning Agent keeps long-term lessons.

## Required Handoff Rule

When one agent needs another agent:

1. Add a short message to `.otto/agent-messages.md`.
2. Include `From`, `To`, `Topic`, `Status`, and `Next Action`.
3. Do not include secrets.
4. Master Orchestrator decides the next active agent.

## Slash Command Rule

Use `.otto/commands.md` for quick commands like `/project`, `/approval`, `/post`, `/get`, `/config`, `/code`, `/run`, `/ui`, `/db`, `/debug`, `/deploy`, `/docs`, `/notes`, `/report`, and `/fast`.

Commands still go through Master Orchestrator first.

## Loop Prevention Rule

- If output repeats the same plan, stop generation and call Loop Guard Agent.
- If final answer contains internal planning spam, call Output Control Agent.
- If a workflow is stuck, call Recovery Agent.
- Final answers must not include repeated "let me do..." planning loops.

## Agent Protection Rule

Before changing existing OTTO agent files, read `.otto/agent-protection-policy.md`.

Agent updates, upgrades, deletes, moves, or routing changes require the agent-update password for that request. Do not save or log the password.

## Learning Upgrade Rule

When mistakes repeat, Agent Upgrade Advisor may suggest improvements in `.otto/agent-upgrade-suggestions.md`.

It must ask before changing protected agent files.
