# Shared automation rules

Apply these rules to every agent and every change in this repository.

## Safety and configuration

- Read `src/common/config/env.ts` and `.env.example`; never ask the user to paste a URL, username, password, token, or cookie into a prompt. Do not open or quote local `.env` files; test code reads them through the validated configuration.
- Load target URLs and credentials only from the validated environment configuration. `.env` is local and ignored by Git; CI values may override it.
- Respect `APP_PROFILE`: only run that profile's specs. Generic profiles do not require credentials; do not run Sauce Demo authentication or page objects against a different target.
- Run only against the target configured for the explicitly selected Dev, QA, or staging environment. Target URLs must use HTTPS and are never taken from prompts. Production is blocked in code.
- Never expose environment values in logs, reports, plans, screenshots, test names, generated prompts, or source code.
- Do not perform persistent, destructive, payment, registration, or real-user actions. DummyJSON write endpoints are simulated and must not be treated as persistent.
- Human approval is required before changing production guards, credentials, approved expected data, destructive actions, or CI secrets.

## Playwright standards

- Keep tests independent. Prefer a page-scoped fixture and fresh browser context per test.
- UI specs use Page Objects; keep assertions in tests/assertion helpers, not in Page Objects.
- Locator order: accessible role/name, label, placeholder, test ID, then stable scoped locator with a short explanation.
- Prefer web-first hard assertions. Never use arbitrary sleeps, `waitForTimeout`, focused tests, or silently skipped tests.
- Use the opt-in `authenticatedPage` fixture for Sauce Demo UI flows that need login; it logs in once in that test's isolated context through `LoginPage`. Login tests request only `loginPage`. Generic and API tests do not authenticate. Never capture credentials in traces, screenshots, or video.
- API tests use typed service methods and validate untrusted response JSON before business assertions.
- Keep credentials, base URLs, and expected business values out of specs and Page Objects.

## Quality and workflow

- Use strict TypeScript, ESLint, feature-oriented tests, and existing fixtures/services before adding abstractions.
- Preserve assertion intent; do not soften assertions or update expected values just to make tests pass.
- Run the narrowest relevant test, then `npm run lint` and `npm run typecheck` for framework changes.
- Review every AI-generated change. Agents may not auto-approve or commit.
- Read `README.md` for commands and `docs/agent-prompts.md` for short Planner, Generator, Reviewer, and Healer prompt examples.
