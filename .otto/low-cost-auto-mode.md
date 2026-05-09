# OTTO Low-Cost Auto Mode

Default mode for all OTTO work.

## Default Behavior

- Read only needed files.
- Use Fast Utility Agent first for simple work.
- Use Model Router Agent before agent assignment.
- Use GPT-5 mini when enough.
- Escalate only when needed.
- Keep answers short.
- Avoid full finalization unless project work needs it.

## Escalation

| Need | Escalate To |
| --- | --- |
| Normal coding | GPT-5 |
| Heavy architecture/security/backend/debugging | GPT-5.5 |
| UI ideas | Gemini Free |
| Screenshot/OCR/visual check | GPT-4o |
| Design-to-code | Kombai |
| File generation | OpenCode |

## Avoid

- Reading all `.otto` files every task.
- Calling all agents.
- Long explanations.
- Repeating context.
- Running full `/expert`, `/complete`, `/review`, or `/finalize` unless needed.
