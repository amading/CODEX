# OTTO Finalization Workflow

Use this before saying a project or feature is done.

## Required Final Flow

1. Project Lock Agent confirms the active project.
2. Requirement Trace Agent confirms requirements.
3. Checklist Agent confirms checklist status.
4. Gap Detection Agent finds missing parts.
5. Run/Test Agent checks available tests, build, lint, or basic file validation.
6. Auto Run Agent triggers safe checks after code changes.
7. Debug & QA Agent fixes detected issues or reports blockers.
8. Security Agent checks secrets, `.env`, database safety, and risky code.
9. Completeness Agent checks all program parts.
10. Final Review Agent performs senior final inspection.
11. Code Comment Agent adds short Tagalog comments to every important changed custom code file and section.
12. Output Control Agent keeps the final response short.
13. Documentation Agent writes the project guide.
14. Memory & Learning Agent logs mistakes and lessons.

## Documentation Required After Build

Documentation Agent must create or update project docs with:

- how the program was made
- file-by-file guide
- section/line guide for manual editing
- how to run
- how to test/check
- how to manually edit
- Tagalog notes
- security notes
- editable notes for every changed file
- commit message

## Done Rule

Do not say `done` until:

- active project checked
- files checked
- errors fixed or reported
- security checked
- completeness checked
- final review passed
- docs/Tagalog guide updated
- important inline code comments are Tagalog and cover each changed file
- project notes include editable section guide
- project notes include file-by-file manual edit guidance
- commit message created

## If Checks Cannot Run

Say why checks could not run and what manual check is needed.
