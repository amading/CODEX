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
| Claude | Claude/Anthropic | Use Haiku for cheap work, Sonnet for standard/strong work, Opus for deep work. |

If the current app cannot auto-switch models, keep using the active model and follow this as a manual routing guide.

## Avoid

- Reading all `.otto` files every task.
- Calling all agents.
- Long explanations.
- Repeating context.
- Running full `/expert`, `/complete`, `/review`, or `/finalize` unless needed.
