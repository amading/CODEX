# OTTO Agent Routing Table — v2.0

Reusable agent routing rules for any project in this workspace.
Project folder names are defined in the root AGENTS.md — not here.
Do NOT hardcode specific project folder names in this file.

---

## 1. Project Identification

The active project folder is whichever top-level folder the user's task belongs to.
Always read root AGENTS.md first if the active project is unclear.

| Folder Type | Role |
|-------------|------|
| `CODEX/` | OTTO agent workspace — permanent, never changes per project |
| Any other top-level folder | A project — defined in root AGENTS.md |

**Hard rule:** Never write to a project folder that is not the active project unless the user explicitly names it.

---

## 2. Agent Profiles (Claude Code Model Mapping)

| Profile  | Model        | Token Cost | Use When |
|----------|--------------|------------|----------|
| cheap    | Haiku 4.5    | Low        | Summaries, lookups, guards, simple edits, commit messages, docs |
| standard | Sonnet 4.6   | Medium     | Normal coding, API work, frontend/backend features, debugging |
| strong   | Opus 4.7     | High       | Complex backend, schema design, security review, hard bugs |
| deep     | Opus 4.7     | Highest    | Production architecture, full system redesign, high-risk changes |
| visual   | Sonnet 4.6   | Medium     | Screenshots, image understanding, OCR, UI review |

**Escalation policy:** Start cheap. Escalate only when the task genuinely needs it.
Never pre-escalate out of caution — if unsure, try standard first.

---

## 3. Full Agent Registry

### 3a. Orchestration Layer

| Agent | Profile | Responsibility | Delegates To |
|-------|---------|----------------|--------------|
| Master Orchestrator | cheap | Reads task, picks routing path, assigns agents, monitors completion | Any |
| Task Manager | cheap | Breaks tasks into subtasks, tracks done/pending, flags blockers | Any |
| Retry Prevention | cheap | Detects when same approach failed before, blocks repeat, proposes alternate | Any |

### 3b. Development Layer

| Agent | Profile | Responsibility | Target |
|-------|---------|----------------|--------|
| Planning | strong | System architecture, folder structure, tech stack decisions | Any |
| Coding | standard | PHP, JS, HTML backend/frontend coding | Active project folder |
| UI/UX | visual | Frontend layout, responsive design, CSS, component structure | Active project `assets/` |
| Debug & QA | standard | Error fixing, log analysis, regression checking, test validation | Active project folder |
| Refactor | standard | Code cleanup, dead code removal, deduplication — no logic changes | Active project folder |
| API Integration | standard | Third-party API calls, OAuth, webhooks, payload mapping | Active project folder |
| Automation | standard | Deploy scripts, CI/CD pipelines, scheduled tasks, shell scripts | Any |

### 3c. Data Layer

| Agent | Profile | Responsibility | Target |
|-------|---------|----------------|--------|
| SQL / Database | strong | Schema changes, migrations, complex queries, optimization | Active project `database/` |
| Database Readonly | strong | SELECT/SHOW/DESCRIBE only — zero writes, zero schema changes | Active project `database/` |
| Database Guard | cheap | Intercepts and blocks DELETE/DROP/TRUNCATE/unsafe UPDATE | Any DB work |
| Data Validator | standard | Validates data types, constraints, foreign keys before any write | Any DB work |

### 3d. Security Layer — Always Active

| Agent | Profile | Responsibility | Bypass Allowed |
|-------|---------|----------------|----------------|
| Database Guard | cheap | Blocks destructive DB commands | Never |
| ENV Protection | cheap | Blocks .env file reads, writes, or exposure | Never |
| Secret Guard | cheap | Blocks API keys, tokens, passwords from appearing in output | Never |
| Security | strong | Input validation, XSS/SQLi/CSRF review, access control audit | Never |
| Permission Guard | cheap | Enforces file-scope rules — no cross-project writes | Never |

### 3e. Knowledge & Memory Layer

| Agent | Profile | Responsibility | Target |
|-------|---------|----------------|--------|
| RAG & Search | standard | Document search, knowledge retrieval, semantic lookup | `CODEX/docs/` |
| Memory | cheap | Writes lessons, mistakes, and decisions to memory | `CODEX/.otto/memory/` |
| Documentation | cheap | Updates notes.md, README, inline comments, changelogs | Any |
| Tagalog Notes | cheap | Writes Tagalog explanation comments and guides | Any custom code |

### 3f. Utility Layer

| Agent | Profile | Responsibility | Target |
|-------|---------|----------------|--------|
| Vision | visual | Images, screenshots, barcodes, OCR, UI screenshots | Any |
| Commit | cheap | Generates git commit messages and changelogs | Any |
| Fast Chat | cheap | Quick answers, simple lookups, clarifications | Any |
| Summarizer | cheap | Condenses long outputs, meeting notes, logs | Any |

---

## 4. Routing Decision Tree

```
START: New task received
│
├── Is this a question / lookup only?
│   └── YES → Fast Chat (cheap) → DONE
│
├── Is this a security concern (auth, secrets, access)?
│   └── YES → Security (strong) + activate all Security Layer agents → DONE
│
├── Is this a database task?
│   ├── Read-only (SELECT/SHOW) → Database Readonly (strong)
│   ├── Write/schema change → Data Validator → Database Guard check → SQL/Database (strong)
│   └── Destructive command detected → Database Guard BLOCKS immediately
│
├── Is this a frontend/UI task?
│   ├── Has screenshots/images → Vision (visual) + UI/UX (visual)
│   └── CSS/HTML/layout only → UI/UX (visual)
│
├── Is this a coding task?
│   ├── Small fix (< 50 lines) → Coding (standard)
│   ├── API/integration work → API Integration (standard)
│   ├── Debugging → Debug & QA (standard)
│   ├── Architecture/design → Planning (strong)
│   └── Production-critical, high-risk → Planning (strong) → deep review
│
├── Is this documentation?
│   └── YES → Documentation (cheap) ± Tagalog Notes (cheap)
│
├── Is this a deployment/automation task?
│   └── YES → Automation (standard) + Security review if touching credentials
│
└── Unclear task?
    └── Master Orchestrator reads AGENTS.md → re-routes → retry once → escalate to user
```

---

## 5. Escalation Chain

```
cheap → standard → strong → deep → USER (manual decision required)
```

| Trigger | Escalation Action |
|---------|-------------------|
| Task complexity exceeds agent capability | Escalate one level |
| Security risk detected mid-task | Immediately activate Security (strong) |
| Same approach failed twice (Retry Prevention fires) | Escalate + notify user |
| Production data is in scope | Escalate to strong minimum |
| .env or secrets referenced | ENV Protection + Secret Guard block + notify user |
| Unknown schema or unfamiliar codebase | Planning (strong) before any Coding |
| Cross-project write attempted | Permission Guard blocks + notify user |

---

## 6. Parallel vs Sequential Routing

### Run in parallel when:
- Tasks are fully independent (e.g. UI/UX + Documentation)
- Read-only agents can run alongside each other (e.g. RAG & Search + Database Readonly)
- Guard agents always run in parallel with any coding or DB agent

### Run sequentially when:
- Output of one agent is the input of the next (Plan → Code → QA)
- Any DB write must follow Data Validator → Database Guard → SQL agent order
- Security review must complete before deployment automation runs

### Never parallelize:
- Two agents writing to the same file at the same time
- Database write agents with each other
- Any agent that follows a blocking guard that has not yet cleared

---

## 7. Inter-Agent Handoff Protocol

When one agent hands off to another, it must pass:

```
HANDOFF BLOCK:
  from: <agent name>
  to: <agent name>
  task_summary: <one line>
  files_touched: [list]
  decisions_made: [list]
  open_questions: [list]
  risk_flags: [list]
```

The receiving agent reads the handoff block before starting.
If a handoff block is missing, the receiving agent requests it before proceeding.

---

## 8. Credit Optimization Rules

1. Always start with the cheapest sufficient profile.
2. Do not run strong/deep agents for tasks that standard can handle.
3. Guard agents are always cheap — no upgrade allowed.
4. Do not run Orchestrator and Task Manager on trivial single-step tasks.
5. Summarizer runs after any long agent output to compress context before the next agent.
6. If an agent produces output > 500 lines, Summarizer condenses it before passing to next agent.
7. Do not re-route a completed task just to reformat output.

---

## 9. Security Enforcement Matrix

| Action | Guard Agent | Behavior |
|--------|-------------|----------|
| Read `.env` file | ENV Protection | BLOCK + alert |
| Write `.env` file | ENV Protection | BLOCK + alert |
| Print API key or token | Secret Guard | REDACT + alert |
| Run DELETE/DROP/TRUNCATE | Database Guard | BLOCK + require explicit user confirmation |
| Unsafe UPDATE (no WHERE) | Database Guard | BLOCK + alert |
| Write to non-active project folder | Permission Guard | BLOCK + alert |
| Cross-project folder read for code changes | Permission Guard | BLOCK + alert |
| Deploy with unreviewed credentials | Security | BLOCK + require Security agent review |

All security agents:
- Cannot be disabled by any other agent
- Cannot be disabled by user prompt mid-task (must be reconfigured in AGENTS.md)
- Log every block action to `CODEX/.otto/memory/security-log.md`

---

## 10. Task Routing Rules (Detailed)

### Rule 1 — Always read root AGENTS.md first
The project folder list and structure live in root AGENTS.md.
Routing agents must read it if the active project is unclear.

### Rule 2 — Scope all changes to the active project folder
Do not edit files outside the active project folder unless the user explicitly names it.
Permission Guard enforces this automatically.

### Rule 3 — CODEX is permanent and shared
`CODEX/` and `CODEX/.otto/` are the permanent agent workspace.
They are reused across all projects — never project-specific content inside.

### Rule 4 — Escalate only when justified
Use the cheapest sufficient profile.
Escalate to strong/deep only for:
- Complex schema changes
- Security-critical code paths
- New full system architecture
- Hard production bugs
If the task is small, stay cheap or standard.

### Rule 5 — All security agents are always active
Database Guard, ENV Protection, Secret Guard, and Permission Guard are always on.
They run in parallel with every task and cannot be bypassed.

### Rule 6 — Retry Prevention fires after two identical failures
If the same approach fails twice, Retry Prevention blocks the third attempt,
logs the failure to memory, and requires either a new approach or user input.

### Rule 7 — Every dev task ends with the standard summary
```
## Dev Summary
1. Files changed (full paths)
2. What was tested and how
3. Security review notes
4. Tagalog notes (plain language explanation)
5. Suggested git commit message
6. Manual edit guide (step-by-step if the user wants to apply changes themselves)
```

### Rule 8 — Memory is written after every significant decision
After any task that involved an architectural decision, a bug fix lesson, or a security finding,
Memory agent writes an entry to `CODEX/.otto/memory/`.
Format: date + task summary + decision + outcome.

### Rule 9 — Planning always runs before major Coding tasks
For any task involving new modules, new database tables, new API endpoints, or new folder structures,
Planning (strong) must produce a design before Coding (standard) begins.

### Rule 10 — Documentation agent runs after every completed feature
After Coding or SQL completes, Documentation agent updates the relevant notes.md or README.
Tagalog Notes agent adds a plain Tagalog comment block if the code is custom business logic.

---

## 11. Error Recovery Paths

| Failure Type | Recovery Action |
|--------------|-----------------|
| Agent produces empty/incomplete output | Retry once at same level, then escalate |
| Agent contradicts a guard agent | Guard wins — task is blocked until resolved |
| Routing loop detected (same agent re-invoked 3x) | Master Orchestrator breaks loop, notifies user |
| File write fails | Check permissions, log error, do not retry silently |
| DB connection fails | Database Readonly tries again once; SQL agent waits for user confirmation |
| Security block triggered mid-task | Full stop — do not continue until user reviews |
| Memory write fails | Log to console output, continue task, retry memory write at end |

---

## 12. Cross-Project Reference Rules

| From | To | When Allowed |
|------|----|--------------|
| `CODEX/` | Any project folder | Reading structure for planning only — no writes |
| Any project folder | `CODEX/docs/` | Referencing OTTO setup guides — read only |
| Any project folder | Another project folder | Only when user explicitly names the target folder |
| Any agent | `CODEX/.otto/memory/` | Write allowed — for Memory agent only |

---

## 13. Memory Storage

| Memory Type | Location |
|-------------|----------|
| Lessons & mistake logs | `CODEX/.otto/memory/lessons.md` |
| Security incident log | `CODEX/.otto/memory/security-log.md` |
| Architecture decisions | `CODEX/.otto/memory/decisions.md` |
| Agent performance notes | `CODEX/.otto/memory/agent-notes.md` |

Create files on first write. Append — never overwrite existing entries.

---

## 14. Model Routing Reference

See: [model-routing.json](model-routing.json)

---

## 15. Tagalog Notes

Ang routing table na ito ay reusable — hindi kailangang baguhin kapag nagpalit ng project.
Ang CODEX folder ay palaging pareho sa lahat ng projects.
Ang nagbabago lang ay ang root AGENTS.md kapag nagdagdag o nagbago ng project folder.

Ang lahat ng security agents (Database Guard, ENV Protection, Secret Guard, Permission Guard)
ay palaging aktibo — walang paraan para i-bypass ang mga ito sa loob ng isang task.

Ang escalation chain ay: cheap → standard → strong → deep → USER.
Huwag agad mag-escalate — simulan sa pinaka-mura na agent na kaya ng trabaho.

Kapag may nabigong approach nang dalawang beses, ang Retry Prevention agent ang mag-block
ng ikatlong pagsubok at mag-log ng lesson sa memory folder.
