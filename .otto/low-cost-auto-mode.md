# OTTO Low-Cost Auto Mode

Default mode for all OTTO work.

## Default Behavior

- Read only needed files.
- Use Fast Utility Agent first for simple work.
- Use Model Router Agent before agent assignment.
- Use `.otto/model-routing.json` for provider/model selection.
- Use the `cheap` profile when enough.
- Escalate only when needed.
- Keep answers short.
- Avoid full finalization unless project work needs it.

## Escalation

| Need | Escalate To |
| --- | --- |
| Simple edits, summaries, docs | cheap profile |
| Normal coding | standard profile |
| Heavy architecture/security/backend/debugging | strong profile |
| Production-critical review or incident analysis | deep profile |
| UI ideas, screenshot/OCR/visual check | visual profile |
| File generation and local repo automation | tool profile |

## Provider Preference

| Workspace | Preferred Provider | Behavior |
| --- | --- | --- |
| Codex | Codex/OpenAI | Use Codex/OpenAI models and local tools from `.otto/model-routing.json`. |
| Cursor | Cursor | Use Cursor Auto first, then Cursor Max for strong/deep work. |
| Claude | Claude/Anthropic | Use claude-haiku-4-5 for cheap work, claude-sonnet-4-6 for standard/strong work, claude-opus-4-7 for deep work. |

## Claude Model IDs (Current)

| Profile | Claude Model ID |
| --- | --- |
| cheap | `claude-haiku-4-5` |
| standard | `claude-sonnet-4-6` |
| strong | `claude-sonnet-4-6` |
| deep | `claude-opus-4-7` |
| visual | `claude-sonnet-4-6` (vision-capable) |
| tool | `claude-sonnet-4-6` (tool-use mode) |

## Codex / OpenAI Model IDs (Current)

| Profile | Codex / OpenAI Model ID |
| --- | --- |
| cheap | `gpt-4o-mini` (GPT-5 mini equivalent) |
| standard | `gpt-4o` (GPT-5 mini or GPT-5 when needed) |
| strong | `gpt-4o` or `gpt-4.1` (GPT-5 strong) |
| deep | `o3` or `gpt-4.1` high reasoning (GPT-5.5 when available) |
| visual | `gpt-4o` (vision-capable, GPT-4o) |
| tool | `codex-mini-latest` / OpenCode local tools |

## OpenCode (Free Backend Tool)

OpenCode is a free, open-source AI coding tool for backend work.

| Profile | OpenCode Usage |
| --- | --- |
| cheap | Free local model via Ollama |
| standard | Free backend code generation and file writing |
| strong | **Preferred free tool** for backend APIs, DB files, routes, services |
| deep | Strongest available model for critical backend review |
| visual | Not recommended — use Claude Sonnet or GPT-4o for visual work |
| tool | **Primary free tool** for all file/code generation and terminal tasks |

### How to Use OpenCode for Backend

```bash
# Install OpenCode (one time)
npm install -g opencode-ai

# Run OpenCode in your project folder
opencode
```

### When to Use OpenCode

- Creating PHP, JS, Python, or SQL backend files (free)
- Writing API routes and controllers (free)
- Generating database schemas and migrations (free)
- Running terminal commands for the backend (free)
- File and folder generation tasks (free)

### When NOT to Use OpenCode

- Screenshots, OCR, image analysis → use Claude Sonnet visual
- UI/UX design and layout → use Claude Sonnet or UI/UX Agent
- High-risk production security review → use Claude Opus or Security Agent

If the current app cannot auto-switch models, keep using the active model and follow this as a manual routing guide.

## Avoid

- Reading all `.otto` files every task.
- Calling all agents.
- Long explanations.
- Repeating context.
- Running full `/expert`, `/complete`, `/review`, or `/finalize` unless needed.
