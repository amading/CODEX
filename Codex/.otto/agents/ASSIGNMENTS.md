# OTTO Agent Assignments

The Master Orchestrator Agent uses this map to assign work.

## Assignment Flow

1. Master Orchestrator Agent reads the user request.
2. Model Router Agent selects the cheapest useful model/tool.
3. Approval Gate Agent checks if permission is required.
4. Master Orchestrator Agent selects the correct agent.
5. Assigned agent performs the work.
6. Project Lock Agent confirms the active project.
7. Run/Test Agent checks files/tests/build when available.
8. Debug & QA Agent fixes or reports issues.
9. Reporter Agent logs blockers/repeated failures and escalates when needed.
10. Security Agent checks secrets, `.env`, permissions, and database safety.
11. Documentation Agent writes how it was made, Tagalog guide, and commit message.
12. Memory & Learning Agent records mistakes or lessons.

## Agent Assignment Map

| Request Type | Primary Agent | Support Agents |
| --- | --- | --- |
| Select/create project | Master Orchestrator Agent | Memory & Learning, Documentation |
| Model/tool routing | Model Router Agent | Master Orchestrator |
| Create project | Project Creator Agent | Fullstack Development, UI/UX, Documentation |
| Upgrade project | Project Upgrade Agent | Project Lock, Fullstack Development, Debug & QA |
| Project lock/check | Project Lock Agent | Master Orchestrator |
| Approval check | Approval Gate Agent | Master Orchestrator, Security |
| Change OTTO agents | Approval Gate Agent | Master Orchestrator, Security |
| Suggest agent upgrades | Agent Upgrade Advisor | Memory & Learning, Approval Gate |
| New app/project | Fullstack Development Agent | UI/UX, Database, Security, Documentation |
| Backend code | Fullstack Development Agent | Database, Security, Debug & QA |
| Frontend/UI | UI/UX Agent | Fullstack Development, Debug & QA, Documentation |
| REST API | Fullstack Development Agent | Database, Security, Debug & QA |
| Project config/INI | API Config Agent | Security, Documentation |
| GET/POST endpoints | GET/POST Endpoint Agent | Database, Security, Debug & QA |
| Database query/schema | Database Agent | Security, Debug & QA |
| Create database/schema/migration | Database Creator Agent | Database, Security, Documentation |
| Product web/backend lookup | Web Scraper / Backend Fetch Agent | RAG & Vision, Security, Documentation |
| Deployment/Docker/VPS | Automation & Deployment Agent | Security, Documentation |
| Auth/login/JWT | Fullstack Development Agent | Security, Database, Debug & QA |
| Bug/error/log | Debug & QA Agent | Fullstack Development, Security |
| Requirement tracking | Requirement Trace Agent | Checklist, Completeness |
| Project checklist | Checklist Agent | Requirement Trace, Gap Detection |
| Gap detection | Gap Detection Agent | Completeness, Coding/UI/Database agents |
| Completeness review | Completeness Agent | Requirement Trace, Checklist, Gap Detection |
| Final senior review | Final Review Agent | Completeness, QA, Security, Documentation |
| Repeated output loop | Loop Guard Agent | Output Control, Recovery, Memory & Learning |
| Noisy final answer | Output Control Agent | Master Orchestrator |
| Stuck/broken workflow | Recovery Agent | Debug & QA, Memory & Learning |
| Report blocker/repeated failure | Reporter Agent | Master Orchestrator, Recovery, Loop Guard |
| Run/test/fix project | Run & Fix Agent | Approval Gate, Debug & QA, Security |
| Run active project | Run & Fix Agent | Project Lock, Run/Test, Debug & QA, Approval Gate |
| Auto-check after code changes | Auto Run Agent | Run/Test, Run & Fix, Project Lock |
| Terminal command | Terminal Runner Agent | Approval Gate, Run & Fix |
| Install package | Package Installer Agent | Approval Gate, Security, Documentation |
| Run tests/build/lint | Run/Test Agent | Run & Fix, Debug & QA |
| Add Tagalog code comments | Code Comment Agent | Documentation, Debug & QA |
| Dependency review | Dependency Audit Agent | Security, Package Installer |
| Local dev server | Local Server Agent | Approval Gate, Run & Fix |
| Screenshot/OCR/docs search | RAG & Vision Agent | Documentation, Debug & QA |
| Dashboard/report/export | Analytics & Reports Agent | Database, UI/UX, Documentation |
| README/tutorial/Tagalog guide | Documentation Agent | Memory & Learning |
| Tagalog project notes/comments | Documentation Agent | Code Comment, Memory & Learning |
| Small/simple task | Fast Utility Agent | Documentation if needed |
| Mistake/retry prevention | Memory & Learning Agent | Debug & QA, Documentation |

## Cost Rule

Use GPT-5 mini first when enough. Use GPT-5 only for complex backend, architecture, SQL, reports, or difficult debugging. Use Gemini Free first for low-cost UI ideas if available. Use GPT-4o/Kombai for UI screenshots, OCR, visual checking, or design-to-code work.

## Super Fast Rule

- Prefer one primary agent and only necessary support agents.
- Do not call every agent for every task.
- Do not create long reports unless requested.
- For coding: Fullstack Development Agent + Debug & QA Agent + Security Agent.
- For full project generation: Requirement Trace Agent + Checklist Agent + Coding/UI/Database agents + Gap Detection Agent + Completeness Agent + Final Review Agent.
- For stuck/looping output: Loop Guard Agent + Output Control Agent + Recovery Agent.
- For run/fix: Run & Fix Agent + Debug & QA Agent + Approval Gate Agent.
- After code changes: Auto Run Agent + Run/Test Agent + Debug & QA Agent.
- After coding: Code Comment Agent + Documentation Agent.
- For terminal commands: Terminal Runner Agent + Approval Gate Agent.
- For package installs: Package Installer Agent + Security Agent + Documentation Agent.
- For project creation: Project Creator Agent + Fullstack Development Agent + Documentation Agent.
- For project upgrades: Project Upgrade Agent + Project Lock Agent + Debug & QA Agent.
- For config/API setup: API Config Agent + GET/POST Endpoint Agent + Security Agent.
- For UI: UI/UX Agent + Debug & QA Agent.
- For database: Database Agent + Security Agent.
- For database creation: Database Creator Agent + Database Agent + Security Agent.
- For docs: Documentation Agent + Memory & Learning Agent.

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
