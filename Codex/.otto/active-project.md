# OTTO Active Project Lock

Active Project: tic-toc-tips

Project Path:

```text
.otto/projects/tic-toc-tips/
```

## Rule

Before editing project files, confirm the requested work belongs to the active project.

If the user mentions a different project, ask before switching.

## Switch Project

Use:

```text
/project <project-name>
```

Example:

```text
/project inventory-app
```

## Safety

- Do not edit another project unless the user switches project.
- Do not guess the project when multiple projects exist.
- Do not touch `.env` or secrets.
