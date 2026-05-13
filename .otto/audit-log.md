# OTTO Audit Log

## 2026-05-13

- Added `Claude Model:` field to all 40 OTTO agent files — claude-haiku-4-5 for cheap agents, claude-sonnet-4-6 for strong agents. No existing content removed.
- Updated `model-routing.json` with specific Claude model IDs: claude-haiku-4-5, claude-sonnet-4-6, claude-opus-4-7 in all profile entries.
- Upgraded all 40 agent Super Agent Mode sections with numbered step-by-step reasoning protocols.
- Added OWASP Top 10 checklist and severity rating (critical/high/medium/low) to Security Agent.
- Added 5 Whys root cause protocol and adjacent-code check rule to Debug & QA Agent.
- Added rollback-query requirement and N+1 detection to Database Agent.
- Added mobile-first + WCAG accessibility rules to UI/UX Agent.
- Added risk rating scale (safe/low/medium/high/critical) to Approval Gate Agent.
- Added "think step by step" and "ask before guessing" universal rules to all core agents.
- Added Super Agent Mode to agents that were missing it: Checklist, Gap Detection, Local Server, Package Installer, Terminal Runner, Run/Test, Requirement Trace, Project Creator, Project Lock, Project Upgrade, Agent Upgrade Advisor.
- Upgraded system files: audit-log, approval-policy, finalization-workflow, low-cost-auto-mode, decision-log, agent-messages, task-board, project-generator-workflow, README.
- Confirmed Claude Code works with all OTTO agents without requiring OpenCode installation.

No secrets, `.env` files, or database data were accessed.

## 2026-05-11

- Added workspace-level project-note guidance so agents treat the outer root as the scope source and not only the nested app folder.
- Added a 100-item OTTO agent upgrade checklist for comments, manual edit guides, validation, safety, and handoff discipline.
- Strengthened AGENTS instructions so custom code changes require short inline comments and file-by-file edit notes.
- Expanded the code-comment and documentation workflows so every important changed file gets a manual-edit guide.
- Added a reusable project template note section for manual edit guidance.

## 2026-05-09

- Created OTTO multi-agent Chat setup documentation.
- Installed root `AGENTS.md` workspace instructions.
- Added lightweight OTTO runtime notes folder.
- Expanded final OTTO agent routing list.
- Added readonly database guard agents.
- Added `.env` and secret protection agents.
- Simplified routing to the requested 12-agent OTTO list.
- Created individual markdown files for all 12 OTTO agents.
- Reverted backend/frontend framework grouping after user correction.
- Grouped individual OTTO agent files into folders.
- Added assignment rules for each OTTO agent.
- Upgraded all OTTO agent files with Super Agent Mode.
- Added When To Use and Quality Checklist sections to every OTTO agent.
- Added shared agent communication logs and protocol.
- Added communication handoff rules to all OTTO agents.
- Added API Config Agent and GET/POST Endpoint Agent.
- Added OTTO slash command routing with `/post`.
- Added 500-item OTTO super upgrade checklist.
- Added OTTO projects folder, template, and `/project` command.
- Added Approval Gate Agent and approval policy.
- Added OTTO agent protection policy without storing the password.
- Added active project lock for `calculator-html`.
- Added end-to-end project generator workflow.
- Added loop guard, output control, recovery, and run/fix agents.
- Added terminal, install, project creator, project upgrade, project lock, run/test, dependency audit, and local server agents.
- Added Database Creator Agent.
- Added finalization workflow for pre-done checks and post-build documentation.
- Added Code Comment Agent and Tagalog inline comment finalization rule.
- Added `/run` and `/notes` command routing and strengthened `/project` lock behavior.
- Added Agent Upgrade Advisor and upgrade suggestions workflow.
- Updated UI/UX Agent routing to allow Gemini Free as low-cost UI option.
- Upgraded Code Comment Agent with section/line manual edit guide.
- Added global OTTO Expert Mode and Auto Run Agent.
- Added completeness, requirement trace, checklist, gap detection, and final review agents.
- Completed `pos-web` UI navigation, payment flow, empty states, and layout polish.
- Added Model Router Agent and low-cost auto mode.
- Created `tic-toc-tips` HTML timer project with advanced wait tips.
- Converted `tic-toc-tips` into a Tik Tok beat tapping HTML game after user correction.
- Added Web Scraper / Backend Fetch Agent with `/lookupproduct` routing.

## 2026-05-10

- Upgraded OTTO communication with structured message bus fields (Message ID, Priority, Needs, statuses).
- Added blocker escalation and repeated-error reporting rules.
- Added Reporter Agent and wired it into routing/assignments.
- Added initial activation messages in `.otto/agent-messages.md`.

No secrets, `.env` files, or database data were accessed.
