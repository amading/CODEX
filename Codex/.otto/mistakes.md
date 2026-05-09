# OTTO Mistakes And Lessons

Use this file to record repeated mistakes and how to avoid them.

## Current Lessons

- Do not rely on Chat instructions alone for real model switching. Real auto-switching requires platform support such as Auto mode, OpenCode routing, Agents SDK, LiteLLM, OpenRouter, or a custom API router.
- Never read, print, or summarize `.env` files or secrets.
- Treat database access as readonly unless the user explicitly approves a safe write operation.
- Do not create too many fake agents when a smaller practical list is cheaper.
- Keep answers short when the user asks for short answers.
- If output starts repeating the same plan, stop and use Loop Guard Agent.
- Do not show repeated internal planning text to the user.
- Do not leave important custom project comments in English when user wants Tagalog comments.
- Clarify "tic toc/tik tok" requests before assuming it means a timer app; user intended a game.
