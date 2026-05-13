# OTTO Approval Policy

Controls when agents must ask before creating or changing data.

## Current Mode

Approval Mode: ask-first

## Modes

| Mode | Meaning |
| --- | --- |
| `ask-first` | Ask before creating/changing files, project data, configs, API routes, database data, or deployment files |
| `auto-approve-safe` | Auto approve safe docs/code/config generation, but still ask for risky actions |
| `manual-only` | Always ask before any change |

## Risk Rating

Every action must be rated before deciding to ask:

| Rating | Examples | Action |
| --- | --- | --- |
| safe | Reading files, docs, summaries | Auto-proceed |
| low | Creating new project notes, config templates | Auto-proceed in `auto-approve-safe` mode |
| medium | Creating/editing code files, new routes | Ask in `ask-first` mode |
| high | Database writes, package installs, deployments | Always ask |
| critical | DELETE/DROP, `.env` access, secret exposure, OTTO agent edits | Always ask + name exact blast radius |

## Always Ask Before

- database writes
- `DELETE`, `DROP`, `TRUNCATE`, unsafe `UPDATE`
- reading or exposing `.env`
- exposing secrets
- changing OTTO agent files
- deployment to server/VPS
- deleting files
- moving many files
- installing packages
- risky shell commands

## Command

```text
/approval ask-first
/approval auto-approve-safe
/approval manual-only
```

## Confirm Rule

If an agent asks approval for one specific command or action and the user replies:

```text
confirm
```

Only that specific command or action is approved. New commands or riskier actions need new approval.

## Agent Protection

Existing OTTO agent files are protected by `.otto/agent-protection-policy.md`.

Changing, upgrading, moving, or deleting agents requires the user to provide the agent-update password in chat for that request. The password must not be saved or logged.
