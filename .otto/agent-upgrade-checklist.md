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
