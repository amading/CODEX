# OTTO Agent Protection Policy

This protects existing OTTO agent files from unwanted changes.

## Protected Files

- `.otto/agents/**/*.md`
- `.otto/agent-routing.md`
- `.otto/agents/ASSIGNMENTS.md`
- `.otto/commands.md`
- `.otto/approval-policy.md`
- `.otto/agent-communication.md`

## Rule

No agent may update, upgrade, delete, rename, or move existing agent files unless the user gives the agent-update password in chat for that request.

## Important

The password must never be saved in files, logs, commit messages, screenshots, or documentation.

## Allowed Without Password

- Reading agent files
- Explaining how agents work
- Creating normal project files outside protected agent system files
- Updating project task files under `.otto/projects/`

## Requires Password

- Editing agent definitions
- Editing agent assignments
- Editing slash commands
- Editing routing rules
- Deleting agent files
- Moving agent folders
- Upgrading agent behavior

## Security Rule

If a user provides the password, use it only for the current request. Do not log it.
