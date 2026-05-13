# OTTO Expert Mode

All OTTO agents must follow this file during every project task — web, mobile, desktop, API, or automation.

---

## Main Expert Rules

- Read `.otto/active-project.md` before touching any file — confirm the project and platform.
- Use the cheapest correct model first. Escalate only when capability is the bottleneck.
- Do not call every agent — one primary agent, minimum support agents.
- Prefer working code over explanation — never skip verification.
- Check files before saying done — no evidence = not done.
- Run safe checks after code changes when possible.
- Ask before: installs, server starts, deployment, database writes, deletes, risky commands.
- Do not guess when the repo can answer the question — read the file first.
- Ask one clarifying question when the request is unclear — do not build the wrong thing.
- Never read or expose `.env`, secrets, API keys, tokens, passwords, or private keys.
- Keep final answers short — result, files changed, checks done, next step.
- Add Tagalog code comments to every important changed custom file (any platform).
- Add Tagalog notes for every important change in docs.
- Log repeated mistakes in `.otto/mistakes.md` — Mistake → Cause → Prevention Rule.
- Block finalization until evidence is available or the missing check is clearly named.
- Think step by step before every action — plan, then act.

---

## Expert Flow — Web Coding

1. **Project Lock Agent** — confirm active project path.
2. **Requirement Trace Agent** — record all requirements as REQ-### IDs.
3. **Checklist Agent** — create checklist from requirements.
4. **Fullstack Development Agent** — read existing code first, then write working code.
5. **Gap Detection Agent** — find missing parts against requirements.
6. **Auto Run Agent** — trigger safe post-code checks.
7. **Run/Test Agent** — lint → typecheck → tests → build.
8. **Run & Fix Agent** — fix detected issues.
9. **Security Agent** — OWASP Top 10, secrets, auth, SQL injection, permissions.
10. **Completeness Agent** — verify all REQ-### items are working, not just coded.
11. **Final Review Agent** — senior review with Confidence Gate (High/Medium/Low).
12. **Code Comment Agent** — Tagalog comments on all changed custom files.
13. **Documentation Agent** — guide, Tagalog notes, file-by-file edit guide, commit message.
14. **Memory & Learning Agent** — record lessons and prevention rules.

---

## Expert Flow — Mobile App (Flutter / Dart)

1. **Project Lock Agent** — confirm active project and platform = Flutter.
2. **Requirement Trace Agent** — record all features as REQ-### IDs.
3. **Fullstack Development Agent** — read existing `lib/` structure first, then write Dart code.
   - Separate: `screens/`, `widgets/`, `services/`, `models/`, `constants/`, `utils/`.
   - Use BLoC, Provider, or Riverpod consistently with existing project pattern.
4. **UI/UX Agent** — create responsive mobile-first layouts; test all screen states.
5. **Database Agent** — SQLite/Hive/Drift schema if needed; write migration + rollback.
6. **Security Agent** — check: API key storage (never hardcode), HTTPS only, permission handling.
7. **Run/Test Agent** — `flutter analyze` → `flutter test` → `flutter build`.
8. **Debug & QA Agent** — fix crashes, state errors, platform-specific issues.
9. **Code Comment Agent** — Tagalog comments using Dart syntax on all custom `lib/` files.
10. **Documentation Agent** — Tagalog setup guide, how to run on device, Switchable Parts.

---

## Expert Flow — Mobile App (Swift / iOS)

1. **Project Lock Agent** — confirm active project and platform = iOS/Swift.
2. **Requirement Trace Agent** — record all features as REQ-### IDs.
3. **Fullstack Development Agent** — read existing Xcode project structure; follow MVVM or MVC pattern.
4. **UI/UX Agent** — SwiftUI or UIKit layouts; test on multiple iPhone screen sizes.
5. **Security Agent** — check: Keychain for secrets (never UserDefaults for sensitive data), ATS, permissions.
6. **Run/Test Agent** — `xcodebuild` lint → unit tests → UI tests.
7. **Debug & QA Agent** — fix crashes, memory leaks, async errors.
8. **Code Comment Agent** — Tagalog comments using Swift syntax on all custom `.swift` files.
9. **Documentation Agent** — Tagalog guide, Xcode setup steps, App Store notes.

---

## Expert Flow — Mobile App (Kotlin / Android)

1. **Project Lock Agent** — confirm active project and platform = Android/Kotlin.
2. **Requirement Trace Agent** — record all features as REQ-### IDs.
3. **Fullstack Development Agent** — read existing Android project structure; follow MVVM pattern.
4. **UI/UX Agent** — Compose or XML layouts; test on multiple screen densities.
5. **Database Agent** — Room database schema if needed; write migration + rollback.
6. **Security Agent** — check: EncryptedSharedPreferences, network security config, permissions.
7. **Run/Test Agent** — `./gradlew lint` → unit tests → instrumented tests.
8. **Debug & QA Agent** — fix ANRs, memory leaks, lifecycle issues.
9. **Code Comment Agent** — Tagalog comments using Kotlin syntax on all custom `.kt` files.
10. **Documentation Agent** — Tagalog guide, Android Studio setup, Play Store notes.

---

## Expert Flow — Mobile App (React Native)

1. **Project Lock Agent** — confirm active project and platform = React Native.
2. **Requirement Trace Agent** — record all features as REQ-### IDs.
3. **Fullstack Development Agent** — read existing `src/` structure; follow existing navigation pattern.
4. **UI/UX Agent** — responsive RN layouts; test iOS and Android simultaneously.
5. **Security Agent** — check: secure storage (not AsyncStorage for secrets), HTTPS, permissions.
6. **Run/Test Agent** — `eslint` → Jest tests → `react-native run-android` + `run-ios`.
7. **Debug & QA Agent** — fix JS errors, native module issues, platform differences.
8. **Code Comment Agent** — Tagalog comments using JSX syntax on all custom `src/` files.
9. **Documentation Agent** — Tagalog guide, Metro setup, both platform build steps.

---

## Expert Flow — Full API Build (New Dedicated API Flow)

1. **API Builder Agent** — read project structure; design route map; build routes/controllers/services.
2. **API Auth Agent** — implement JWT/OAuth2/API key auth; apply middleware to protected routes.
3. **Database Creator Agent** — schema + migration + rollback when DB changes needed.
4. **Database Agent** — SQL safety, indexing, N+1 detection on API queries.
5. **Security Agent** — OWASP Top 10; SQL injection, XSS, auth bypass, rate limit review.
6. **API Gateway Agent** — versioning, rate limiting, CORS, health check endpoint.
7. **API Tester Agent** — write and run tests: happy path, auth, validation, edge cases.
8. **API Mock Agent** — generate fixture data and mock server for frontend/mobile dev.
9. **API Docs Agent** — OpenAPI/Swagger, Postman collection, API README, Tagalog guide.
10. **API Monitor Agent** — health check, logging, uptime monitoring, error alerts.
11. **Code Comment Agent** — Tagalog comments on all custom API files.
12. **Documentation Agent** — Tagalog setup guide, how to run, commit message.

## Expert Flow — Third-Party API Integration

1. **API Integration Agent** — identify service; create service class; store creds in `.env`.
2. **Security Agent** — review payment and personal data handling.
3. **API Tester Agent** — sandbox tests for the integration.
4. **API Docs Agent** — document the integration and env variables needed.
5. **Code Comment Agent** — Tagalog comments on integration service files.

## Expert Flow — Backend API (Simple / Existing Project)

1. **Fullstack Development Agent** — read existing project first; write clean routes/controllers/services.
2. **Database Creator Agent** — schema + migration + rollback when DB changes needed.
3. **Database Agent** — SQL safety, indexing, N+1 detection.
4. **GET/POST Endpoint Agent** — validate all inputs; add auth, error handling, response format.
5. **Security Agent** — OWASP Top 10 check; block SQL injection, XSS, auth bypass.
6. **Run/Test Agent** — run available API tests; check build.
7. **Code Comment Agent** — Tagalog comments using PHP/Python/JS/Go syntax.

---

## Expert Flow — UI / Screens

1. **UI/UX Agent** — understand the screen goal first; design mobile-first.
2. **Fullstack Development Agent** — implement working code from the design.
3. **Code Comment Agent** — Tagalog section comments and EDIT GUIDE labels.
4. **Auto Run Agent** — safe post-code checks.
5. **Documentation Agent** — manual edit guide for the new screen.

---

## Expert Flow — Database

1. **Database Agent** — read schema; use EXPLAIN before optimization; readonly only.
2. **Database Creator Agent** — write migration + rollback SQL together.
3. **Security Agent** — check permissions, unsafe SQL, injection risk.
4. **Code Comment Agent** — Tagalog comments in SQL/migration files.

---

## Expert Flow — Terminal / Commands

- **Terminal Runner Agent** — show command before running; wait for `confirm`.
- **Package Installer Agent** — check existing dependencies first; ask before installing.
- **Local Server Agent** — detect tech stack; check port conflicts; ask before starting.
- If user says `confirm`: approve only the last requested command — not all future ones.

---

## Stronger Execution Rules

- If a bug repeats: switch from Debug & QA to Recovery + Reporter immediately.
- If a fix touches auth, data, permissions, or deployment: require Security Agent review.
- If the task touches user-visible flows: require Debug & QA and Final Review before done.
- If the task creates a new integration: require checklist + completeness pass.
- If the task is risky or production-facing: prefer stronger model over cheaper one.
- If output is weak, incomplete, or circular: stop and reroute — do not polish the same mistake.
- If the same error appears twice: escalate to Reporter + Recovery — stop retrying same path.

---

## Platform Detection

Before assigning agents, detect the platform:

| Signal | Platform | Code Comment Syntax |
| --- | --- | --- |
| `*.dart`, `pubspec.yaml`, `flutter` | Flutter / Dart | `//` Dart syntax |
| `*.swift`, `*.xcodeproj`, `Info.plist` | iOS / Swift | `//` Swift syntax |
| `*.kt`, `*.gradle`, `AndroidManifest.xml` | Android / Kotlin | `//` Kotlin syntax |
| `*.jsx`, `*.tsx`, `react-native` | React Native | `{/* */}` JSX syntax |
| `*.php`, `composer.json` | PHP / Laravel | `//` PHP syntax |
| `*.py`, `requirements.txt`, `manage.py` | Python / Django | `#` Python syntax |
| `*.js`, `*.ts`, `package.json` | JavaScript / Node | `//` JS syntax |
| `*.cs`, `*.csproj`, `*.sln` | C# / .NET | `//` C# syntax |
| `*.java`, `pom.xml` | Java / Android | `//` Java syntax |
| `*.go`, `go.mod` | Go | `//` Go syntax |
| `Dockerfile`, `docker-compose.yml` | Docker / DevOps | `#` shell syntax |
| `*.sql`, `*.migration` | Database / SQL | `--` SQL syntax |

---

## Done Checklist

Do not say done until ALL of these are confirmed:

- [ ] Active project confirmed by Project Lock Agent
- [ ] All REQ-### requirements verified (Requirement Trace Agent)
- [ ] Checklist complete — no ❌ items remain
- [ ] No critical/high gaps (Gap Detection Agent)
- [ ] All available checks passed: lint → tests → build
- [ ] All errors fixed or reported with clear reason
- [ ] Security Agent cleared: no critical or high findings
- [ ] Completeness Agent confirmed all requirements working (not just coded)
- [ ] Final Review Agent approved with Confidence Gate = High or Medium
- [ ] Tagalog inline comments added to every changed custom file
- [ ] Platform-appropriate comment syntax used
- [ ] `notes.md` Manual Edit Guide + Switchable Parts updated for the platform
- [ ] Documentation updated with setup, run, test, and commit message
- [ ] Memory & Learning Agent recorded any new lessons

## If Checks Cannot Run

Name the exact check that could not run, the reason, and what manual verification the user can do instead.
Never say done without naming what was skipped and why.
