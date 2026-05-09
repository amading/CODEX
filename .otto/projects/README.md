# OTTO Projects

Put one folder per project here.

## How To Select A Project

Use:

```text
/project <project-name>
```

Example:

```text
/project inventory-app
```

Then use agent commands:

```text
/code create login system
/post resource=orders fields=customer_id,total,status auth=yes
/ui create dashboard page
/db explain orders table
/docs create setup guide
```

## Project Folder Example

```text
.otto/projects/inventory-app/
  project.md
  tasks.md
  decisions.md
  notes.md
```

Do not store `.env`, secrets, API keys, passwords, or database dumps in this folder.
