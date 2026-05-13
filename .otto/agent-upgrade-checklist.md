# OTTO Agent Upgrade Checklist — v2.0

Use this list when upgrading agents, project workflows, or documentation rules.
Every item is a pass/fail gate. Do not mark a section done if any item is unchecked.
Reference: [agent-routing.md](agent-routing.md) | [model-routing.json](model-routing.json)

---

## Section 1 — Project Control & Scope

1. [ ] Auto-detect the active project root before any file action.
2. [ ] Read root `AGENTS.md` to confirm the active project folder.
3. [ ] Lock the active project before any edit begins.
4. [ ] Refuse all edits outside the active project folder (Permission Guard enforces).
5. [ ] Confirm the project name explicitly before switching projects.
6. [ ] Track the active project in a shared state file, not in memory alone.
7. [ ] Treat every sibling top-level folder as a separate, independent project.
8. [ ] Never assume a nested sub-folder is the project root — confirm from AGENTS.md.
9. [ ] Use full absolute paths in all notes, logs, and handoff blocks.
10. [ ] Keep cross-project work rare, logged, and explicitly user-approved.
11. [ ] Never write to `CODEX/` folders from within a project task.
12. [ ] Confirm that CODEX agent files are not project-specific before editing them.

---

## Section 2 — Agent Profile & Model Selection

13. [ ] Every agent file has a `Claude Model:` field populated.
14. [ ] `cheap` agents use `claude-haiku-4-5` only.
15. [ ] `standard` agents use `claude-sonnet-4-6` only.
16. [ ] `strong` agents use `claude-opus-4-7` only.
17. [ ] `deep` agents use `claude-opus-4-7` only.
18. [ ] `visual` agents use `claude-sonnet-4-6` only.
19. [ ] No security, database design, or architecture task uses a cheap model.
20. [ ] Model escalation includes a one-line justification logged in the handoff block.
21. [ ] Task length alone is never a reason to escalate — escalate only when capability is the bottleneck.
22. [ ] `model-routing.json` matches the model fields in all agent files.
23. [ ] `low-cost-auto-mode.md` is in sync with current model IDs and routing rules.
24. [ ] Model IDs are verified as valid before being added to any routing config.

---

## Section 3 — Routing Compliance

25. [ ] Master Orchestrator reads the Routing Decision Tree before assigning agents.
26. [ ] Task Manager breaks tasks into subtasks before Coding or SQL agents start.
27. [ ] Planning (strong) runs before any Coding task involving new modules, tables, or APIs.
28. [ ] Guard agents (Database Guard, ENV Protection, Secret Guard, Permission Guard) are always active.
29. [ ] Guard agents run in parallel with every task — never sequentially after.
30. [ ] Parallel routing is used when agents are fully independent.
31. [ ] Sequential routing is used when output of one agent feeds the next.
32. [ ] No two agents write to the same file at the same time.
33. [ ] Escalation chain is followed: cheap → standard → strong → deep → USER.
34. [ ] Retry Prevention fires after two identical failed approaches — not before, not after.
35. [ ] Routing loops (same agent re-invoked 3x) trigger Master Orchestrator break + user notification.
36. [ ] Summarizer condenses any agent output over 500 lines before passing to the next agent.

---

## Section 4 — Security Standards

37. [ ] Security Agent checks OWASP Top 10 on every backend code review.
38. [ ] Every security finding has a severity: `critical / high / medium / low / info`.
39. [ ] Critical findings BLOCK progress — task does not continue until resolved.
40. [ ] Every public API endpoint has: input validation, auth check, rate limit note, safe error message.
41. [ ] SQL injection, XSS, CSRF, and path traversal checked on every backend review.
42. [ ] Security Agent runs before every deployment and every database write operation.
43. [ ] Security Agent escalates to strong/deep model when uncertain — never guesses.
44. [ ] Security findings are recorded in `audit-log.md` with severity and resolution status.
45. [ ] No security finding is softened or omitted — name it directly at its true severity.
46. [ ] Deployment configs use environment variable references only — zero hardcoded secrets.
47. [ ] `.env` files are never read, printed, or passed to any agent output.
48. [ ] API keys, tokens, passwords, and private keys never appear in agent output.
49. [ ] Every security block action is logged to `CODEX/.otto/memory/security-log.md`.
50. [ ] No guard agent (Database Guard, ENV Protection, Secret Guard) is bypassed for any reason.

---

## Section 5 — Database Safety

51. [ ] Database Readonly agent is used for all SELECT/SHOW/DESCRIBE tasks.
52. [ ] Data Validator runs before any database write or schema change.
53. [ ] Database Guard intercepts DELETE/DROP/TRUNCATE before SQL agent executes them.
54. [ ] Unsafe UPDATE (missing WHERE clause) is blocked by Database Guard.
55. [ ] Every migration includes rollback SQL alongside the forward SQL.
56. [ ] Schema changes go through Planning (strong) before SQL agent executes them.
57. [ ] Database connection failures trigger one retry then wait for user confirmation.
58. [ ] No destructive DB command runs without explicit user approval in the current session.
59. [ ] Database tables touched are listed in every handoff block and dev summary.
60. [ ] Database Readonly agent is never upgraded to write access within a task.

---

## Section 6 — Commenting & Code Clarity

61. [ ] Every important changed file has a short comment explaining what changed and why.
62. [ ] Every new custom file has a short purpose note at the top.
63. [ ] Important custom-code comments are written in Tagalog.
64. [ ] Comments are short — one line or less unless the logic is non-obvious.
65. [ ] Comments are practical for manual editing — not for explaining basic code.
66. [ ] Only important sections are commented, not every line.
67. [ ] Noisy or duplicated comments are removed.
68. [ ] Third-party library comments are left untouched.
69. [ ] Section markers are added for major editable blocks.
70. [ ] Clear edit hints are placed near fragile or non-obvious logic.

---

## Section 7 — Manual Editing Notes

71. [ ] Every completed task includes a file-by-file manual edit guide.
72. [ ] Guide includes section or line hints for each file.
73. [ ] Guide explains what each file does in plain language.
74. [ ] Guide specifies what a human can safely change.
75. [ ] Guide specifies what must not be changed.
76. [ ] Guide includes dependency notes (what breaks if X is changed).
77. [ ] Guide includes safe override or extension points.
78. [ ] Guide includes required config variable names — never values or secrets.
79. [ ] Guide includes fallback behavior notes.
80. [ ] Guide includes reset and initialization notes where relevant.

---

## Section 8 — Project Notes & Documentation

81. [ ] `notes.md` updated after every important change.
82. [ ] `tasks.md` updated when work is pending or newly completed.
83. [ ] `decisions.md` updated when a design choice is made.
84. [ ] `project.md` updated when project scope changes.
85. [ ] Notes are short, factual, and dated.
86. [ ] Stale notes are archived — not left in active note files.
87. [ ] Active notes are visible at the top of each notes file.
88. [ ] One project folder per project — histories are never mixed.
89. [ ] Documentation Agent runs after every completed feature.
90. [ ] Tagalog Notes Agent runs after every custom business logic change.

---

## Section 9 — Testing & Validation

91. [ ] Syntax validated after every edit.
92. [ ] PHP validated after every PHP change.
93. [ ] JavaScript validated after every JS change.
94. [ ] HTML and CSS validated after every UI change.
95. [ ] Safe checks run automatically when possible.
96. [ ] Small checks run before large checks.
97. [ ] Task stops immediately on any failing check — never continues past a failure.
98. [ ] Failure is explained in plain language — not just an error code.
99. [ ] What was tested is recorded in the dev summary.
100. [ ] What could not be tested is recorded and flagged for manual verification.
101. [ ] Bugs are reproduced before they are fixed — never fix what cannot be confirmed.
102. [ ] Adjacent code checked for the same class of bug after every fix.

---

## Section 10 — Reasoning & Self-Validation

103. [ ] Every agent thinks step by step before acting — no immediate output on complex tasks.
104. [ ] Every agent asks one short clarifying question when the request is ambiguous.
105. [ ] Every agent validates output against the original request before finishing.
106. [ ] No task is marked done without file-level or output-level evidence.
107. [ ] Debug & QA Agent uses 5 Whys method for root cause analysis.
108. [ ] Confidence Gate applied before Final Review approves done: High / Medium / Low.
109. [ ] Low confidence = return to Debug & QA — never mark done.
110. [ ] Self-check: does output answer the original question? Are all required parts present?
111. [ ] Agent does not produce output that contradicts a guard agent's block.
112. [ ] Agent does not skip steps to save tokens — correctness over speed.

---

## Section 11 — Inter-Agent Handoff Protocol

113. [ ] Every handoff includes the structured HANDOFF BLOCK (see agent-routing.md §7).
114. [ ] Handoff block fields populated: `from`, `to`, `task_summary`, `files_touched`, `decisions_made`, `open_questions`, `risk_flags`.
115. [ ] Receiving agent reads the handoff block before starting any work.
116. [ ] Receiving agent requests a handoff block if one is missing — does not start without it.
117. [ ] No context is re-derived when a handoff block already contains it.
118. [ ] Risk flags in the handoff block trigger Security Agent review before the next agent proceeds.
119. [ ] Open questions in the handoff block are resolved before the task is closed.
120. [ ] Handoff blocks are stored in the task log, not discarded after use.

---

## Section 12 — Memory & Learning

121. [ ] Memory Agent writes an entry after every architectural decision.
122. [ ] Memory Agent writes an entry after every bug fix with a non-obvious cause.
123. [ ] Memory Agent writes an entry after every security finding.
124. [ ] `mistakes.md` format: `Mistake → Cause → Prevention Rule`.
125. [ ] Every repeated mistake is added to `mistakes.md` immediately.
126. [ ] Pattern Watch count incremented when the same mistake appears again.
127. [ ] Mistakes reaching count = 3 escalate to Agent Upgrade Advisor.
128. [ ] No blocker message is closed without updating status to `resolved` or `closed`.
129. [ ] Memory write failures are logged to console output and retried at end of task.
130. [ ] Memory entries are appended — never overwrite existing entries.

---

## Section 13 — Credit & Cost Optimization

131. [ ] Cheapest sufficient agent profile used for every task.
132. [ ] Guard agents never upgraded beyond cheap — they are always Haiku.
133. [ ] Orchestrator and Task Manager not invoked for trivial single-step tasks.
134. [ ] Summarizer runs after any agent output over 500 lines.
135. [ ] No re-routing of a completed task just to reformat output.
136. [ ] OpenCode used for backend file/code generation before paid model where available.
137. [ ] OpenCode not used for visual, OCR, or screenshot tasks.
138. [ ] OpenCode not used for high-risk security reviews.
139. [ ] OpenCode usage recorded in `audit-log.md` for cost tracking.
140. [ ] OpenCode fallback to Sonnet standard when OpenCode is unavailable.

---

## Section 14 — UI & App Behavior Documentation

141. [ ] Button wiring documented clearly in comments and notes.
142. [ ] Save flow documented with file path and function name.
143. [ ] Capture flow documented with file path and function name.
144. [ ] Upload flow documented with file path and function name.
145. [ ] Fallback flow documented — what happens when primary path fails.
146. [ ] Error flow documented — what the user sees and what is logged.
147. [ ] Success flow documented — what the user sees and what is written.
148. [ ] Init/reset flow documented — what state is cleared and when.
149. [ ] Parent-child message flow documented — event names and payload shape.
150. [ ] Browser/server boundary marked clearly — what runs client-side vs server-side.

---

## Section 15 — Feature Request Tracking

151. [ ] Every feature request has a `REQ-###` ID before work begins.
152. [ ] No feature is built without a `REQ-###` ID — completeness cannot be verified without one.
153. [ ] `REQ-###` IDs are logged in `tasks.md` with status: `pending / in-progress / done`.
154. [ ] Feature scope is confirmed against the `REQ-###` description before closing.
155. [ ] Scope creep beyond the `REQ-###` is flagged — not silently implemented.

---

## Section 16 — Finalization Gate

Every task must pass all items below before it is marked done.

156. [ ] Tagalog notes written for all custom business logic.
157. [ ] Git commit message suggestion included in dev summary.
158. [ ] File-by-file manual edit guide included.
159. [ ] Testing results recorded (what passed, what failed, what was skipped).
160. [ ] Security review notes included.
161. [ ] Manual-edit tips included for fragile sections.
162. [ ] Rollback hints included when any risky change was made.
163. [ ] Next steps listed if anything remains incomplete.
164. [ ] Active project confirmed one last time before closing.
165. [ ] `notes.md` and inline comments updated — task is NOT done until this is complete.
166. [ ] Memory Agent has written all required entries.
167. [ ] `audit-log.md` updated if any security finding or OpenCode usage occurred.
168. [ ] All handoff open questions resolved or explicitly deferred with reason.
169. [ ] Confidence Gate is High or Medium — Low confidence blocks done status.
170. [ ] Dev summary output matches the standard 7-section format from agent-routing.md §10 Rule 7.

---

## Tagalog Notes

Ang checklist na ito ay ginagamit para ma-verify na kumpleto ang bawat task bago sabihing "tapos na."
Huwag mag-mark ng done kung may hindi pa na-check sa Section 16 — Finalization Gate.

Ang lahat ng security at guard agents ay palaging aktibo — walang bypass kahit anong sitwasyon.
Ang escalation chain ay: cheap → standard → strong → deep → USER.
Huwag mag-escalate dahil mahaba lang ang task — escalate kapag kulang ang kakayahan ng modelo.

Ang memory entries ay isinusulat pagkatapos ng bawat mahahalagang desisyon, bug fix, o security finding.
Ang mga pagkakamali na paulit-ulit ay idinaragdag sa `mistakes.md` at binibilang para sa Pattern Watch.
