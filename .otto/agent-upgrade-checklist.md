# OTTO Agent Upgrade Checklist

Use this list when upgrading agents, project workflows, or documentation rules.

## Core Project Control

1. Auto-detect the active project root.
2. Lock the active project before edits.
3. Refuse edits outside the active project.
4. Confirm the requested project name before switching.
5. Track the active project in a shared file.
6. Keep workspace root rules visible.
7. Treat sibling top-level folders as separate projects.
8. Never assume a nested app folder is the only project.
9. Use explicit file paths in notes.
10. Keep cross-project work rare and intentional.

## Commenting

11. Add short comments to every important changed file.
12. Add a short purpose note to every new custom file.
13. Prefer Tagalog for important custom-code comments.
14. Keep comments short.
15. Keep comments practical for manual editing.
16. Comment only the important sections, not every line.
17. Remove noisy or duplicated comments.
18. Keep third-party comments untouched when safer.
19. Add section markers for major editable blocks.
20. Add clear edit hints near fragile logic.

## Manual Editing Notes

21. Write a file-by-file manual edit guide.
22. Include section or line hints in the guide.
23. Include what each file does.
24. Include what a human can safely change.
25. Include what should not be changed.
26. Include dependency notes.
27. Include safe override points.
28. Include required config names only, not secrets.
29. Include fallback behavior notes.
30. Include reset and initialization notes.

## Project Notes

31. Update `notes.md` after important changes.
32. Update `tasks.md` when work is pending.
33. Update `decisions.md` when a design choice matters.
34. Update `project.md` when the project scope changes.
35. Keep notes short and factual.
36. Keep notes current.
37. Archive stale notes.
38. Keep active notes visible.
39. Keep one project folder per project.
40. Do not mix project histories.

## Testing And Validation

41. Validate syntax after edits.
42. Validate PHP when PHP changes.
43. Validate JavaScript when JS changes.
44. Validate HTML and CSS when UI changes.
45. Run safe checks automatically when possible.
46. Run small checks first.
47. Stop on failing checks.
48. Explain the failure plainly.
49. Record what was tested.
50. Record what could not be tested.

## Safety

51. Do not expose secrets.
52. Do not print `.env` contents.
53. Do not print API keys.
54. Do not print passwords.
55. Do not print tokens.
56. Do not print private keys.
57. Do not run destructive database commands without approval.
58. Avoid risky deletes and truncates.
59. Protect generated files from accidental overwrite.
60. Keep rollback notes when risk exists.

## Handoffs

61. Write what changed.
62. Write why it changed.
63. Write what remains pending.
64. Write the next safe step.
65. Write the files touched.
66. Write the sections touched.
67. Write the functions touched.
68. Write the buttons or controls touched.
69. Write the API routes touched.
70. Write the database tables touched.

## Workflow Quality

71. Prefer small targeted fixes.
72. Preserve existing project patterns.
73. Avoid broad refactors unless needed.
74. Keep architecture modular.
75. Keep output clean and easy to scan.
76. Keep agent instructions simple enough to follow.
77. Keep router files and templates aligned.
78. Keep project files and notes aligned.
79. Keep manual edit instructions consistent.
80. Keep comments and docs synchronized.

## UI And App Behavior

81. Mark button wiring clearly.
82. Mark save flow clearly.
83. Mark capture flow clearly.
84. Mark upload flow clearly.
85. Mark fallback flow clearly.
86. Mark error flow clearly.
87. Mark success flow clearly.
88. Mark init/reset flow clearly.
89. Mark parent-child message flow clearly.
90. Mark browser/server boundary clearly.

## Finalization

91. Include Tagalog notes in final output.
92. Include a commit message suggestion.
93. Include a file-by-file guide.
94. Include testing results.
95. Include security notes.
96. Include manual-edit tips.
97. Include rollback hints when relevant.
98. Include next steps if anything remains.
99. Confirm the active project one last time.
100. Do not say finished until notes and comments are updated.

## Claude Model Support

101. Every agent file must have a `Claude Model:` field.
102. Use `claude-haiku-4-5` for cheap/routing/docs agents.
103. Use `claude-sonnet-4-6` for standard and strong agents.
104. Use `claude-opus-4-7` for deep/critical agents only.
105. Never use a cheap model for security review, database design, or architecture.
106. Model Router Agent must justify escalation in one short reason.
107. Do not escalate just because the task is long — escalate only when capability is the bottleneck.
108. Keep `model-routing.json` and `low-cost-auto-mode.md` in sync with agent model fields.
109. Update `low-cost-auto-mode.md` when new Claude model IDs are released.
110. Confirm Claude model ID is valid before using it in routing.

## OpenCode Free Backend Support

111. Every backend agent must have an `OpenCode:` field stating its free task.
112. Prefer OpenCode for backend file/code generation before using a paid model.
113. Use OpenCode for: PHP, JS, Python, SQL file generation, route and controller files.
114. Do not use OpenCode for visual/OCR/screenshot tasks — use Claude Sonnet visual instead.
115. Install OpenCode once with: `npm install -g opencode-ai`
116. Keep `model-routing.json` opencode entries updated when OpenCode versions change.
117. When OpenCode is unavailable, fall back to Claude Sonnet for backend tasks.
118. Record OpenCode usage in `audit-log.md` for cost tracking.
119. Do not use OpenCode for high-risk security reviews — use Security Agent + Claude Sonnet.
120. Keep OpenCode task scope narrow: file generation, terminal commands, route writing.

## Reasoning And Self-Validation

121. Every agent must think step by step before acting.
122. Every agent must ask one short clarifying question when the request is ambiguous.
123. Every agent must validate its output against the original request before finishing.
124. Never mark a task done without showing file-level or output-level evidence.
125. Use the 5 Whys method for root cause analysis in Debug & QA Agent.
126. Check adjacent code for the same class of bug after every fix.
127. Apply the Confidence Gate (High/Medium/Low) before Final Review Agent approves done.
128. Never say done if Confidence Gate is Low — return to Debug & QA Agent.
129. Reproduce a bug before fixing it — never fix what you cannot confirm exists.
130. Self-check output: does it answer the original question? Are all required parts present?

## Security Standards

131. Security Agent must check OWASP Top 10 on every code review.
132. Every security finding must have a severity rating: critical / high / medium / low / info.
133. Block progress on critical findings — do not continue until resolved.
134. Every public API endpoint must have: input validation, auth check, rate limit note, safe error message.
135. Never soften a critical security finding — name it directly.
136. Deployment configs must use environment variable references only — no hardcoded secrets.
137. Run Security Agent before every deployment and database write operation.
138. SQL injection, XSS, CSRF, and path traversal must be checked on every backend review.
139. Security Agent must escalate to strong/deep Claude model when uncertain.
140. Record security findings in `audit-log.md` with severity and resolution.

## Mistake Prevention

141. Use `mistakes.md` format: Mistake → Cause → Prevention Rule.
142. Add every repeated mistake to `mistakes.md` immediately.
143. Increment Pattern Watch count when the same mistake appears again.
144. Escalate to Agent Upgrade Advisor when a mistake reaches count = 3.
145. Memory & Learning Agent must update `mistakes.md` after every important error.
146. Never close a blocker message without updating its status to `resolved` or `closed`.
147. Use REQ-### IDs for every feature request before building.
148. Never build a feature without a REQ-### ID — completeness cannot be verified without it.
149. Every migration must include rollback SQL alongside forward SQL.
150. Every package install must check existing dependencies first to avoid duplication.
