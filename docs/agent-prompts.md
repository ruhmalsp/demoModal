# Using the QA agents

The workspace agents follow `AGENTS.md`. Select a role in the agent picker or use one of these prompts. Never paste a URL, account name, password, token, or cookie into a prompt. Agents must use the validated environment configuration.

## 1. Plan tests

> Use the Planner. Review the requested feature and current code. Create a numbered test plan under `docs/plans/`. Include UI/API scope, positive and negative cases, preconditions, observable assertions, and gaps. Do not browse outside the configured non-production target or submit forms.

## 2. Generate a UI test

> Use the Generator for plan scenario `<number>`. Reuse the fixtures and Page Objects. Add one independent, tagged UI test, keep assertions outside Page Objects, run that test, and report files and results. Stop before changing environment guards or credentials.

## 3. Generate an API test

> Use the Generator for plan scenario `<number>`. Implement it through the existing API client/service and runtime response contracts. Use approved JSON test data, account for DummyJSON's simulated writes, run the focused API test, and report the result.

## 4. Review locators and assertions

> Use the Reviewer on `<file or feature>`. Check semantic locator quality, assertion strength, test isolation, environment safety, and whether expected values come from approved test data. Report evidence and recommendations; do not edit files.

## 5. Diagnose a failing test

> Use the Healer on `<test name or path>`. Inspect failure output and available trace/screenshot/network evidence. Classify the cause and propose the smallest evidence-based fix. Preserve assertion intent; do not skip tests or edit approved data. Ask before changing shared Page Objects or configuration.

Agents are assistants, not approval systems. Review generated diffs and run lint and type checks before accepting changes.
