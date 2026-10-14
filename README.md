# Playwright UI and API framework

A small, reusable Playwright + TypeScript framework demonstrated against two public practice targets:

- **UI:** Sauce Demo for authentication, inventory, cart, and a synthetic demo checkout.
- **API:** DummyJSON for catalog reads and simulated CRUD responses.

These are separate demos, not one integrated application. DummyJSON simulates write responses; tests never assume changes persist. This repository does not create a local app.

## Setup (PowerShell)

```powershell
node --version
npm ci
npx playwright install chromium firefox webkit
npm run env:validate
npm run lint
npm run typecheck
```

The framework reads `.env` if present and uses demo defaults from `.env.example` for any missing settings. Copy `.env.example` to `.env` only when you need local overrides; do not overwrite an existing `.env`. Process/CI variables take precedence. Set `APP_PROFILE` to select the matching UI suite:

```dotenv
# Existing Sauce Demo tests and the shared login setup
APP_PROFILE=sauce-demo
DEV_UI_BASE_URL=https://www.saucedemo.com

# Or a generic, unauthenticated page-load smoke against another approved site
APP_PROFILE=generic
DEV_UI_BASE_URL=https://your-approved-test-site.example
```

`generic` does not require a username/password and does not run Sauce Demo login. Its starter test only confirms the configured site's home page responds successfully. For application-specific coverage, add Page Objects and tests under `tests/ui/<profile-name>/`, then map that profile to its test directory in `playwright.config.ts`; implement authentication only if that application requires it. Update `DEV_API_BASE_URL` separately for the API target. Target URLs must use HTTPS and must not contain credentials. Private credentials belong in ignored `.env` files or protected CI variables.

## Run tests

```powershell
npm run test:smoke       # Chromium UI + API smoke tests
npm run test:regression  # Chromium UI + API regression tests
npm run test:ui          # Chromium only
npm run test:ui:all      # Chromium, Firefox, WebKit, mobile Chrome, mobile Safari
npm run test:api         # API only; no browser
npm run test:mobile      # Mobile browser emulation
npm run test:firefox
npm run test:webkit
npm run report
```

Run a tag or one feature file:

```powershell
npx playwright test --project=chromium --grep @negative
npm run test:api -- tests/api/products.api.spec.ts
npm run test:ui -- tests/ui/checkout.spec.ts
```

To run QA or staging, set that environment's own target URLs and credentials in `.env` or CI, then run `npm run test:qa` or `npm run test:staging`. The framework does not fall back to Dev URLs or credentials. Production is rejected; select the environment that matches the target and use only approved non-production systems.

## Authentication and fixtures

In the `sauce-demo` profile, opt-in `authenticatedPage` and Sauce Demo Page Object fixtures use the `LoginPage` to sign in once per test. Specs that test login request only `loginPage`, so they start unauthenticated and do not log in twice. API-only and `generic` profile runs skip authentication entirely; generic UI uses an empty browser context and requires no username or password. Sauce Demo projects disable traces, screenshots, and video to avoid recording credential entry. Per-test login is simple and isolated, but slower for a very large suite; a dedicated global setup/storage state can be considered later if execution time becomes significant and its state lifecycle is managed deliberately.

Fixtures in `src/common/fixtures/test.fixture.ts` provide Page Objects, authenticated page, API client/service, and validated approved test data. Put locators/actions in `src/pages/`, API methods in `src/services/`, and business expectations in `tests/data/`; keep assertions in tests.

Example UI test (under `tests/ui/<profile-name>/`):

```ts
import { test, expect } from '../../../src/common/fixtures/test.fixture';

test('@smoke inventory shows the approved product', async ({ inventoryPage, testData }) => {
  await expect(inventoryPage.product(testData.productName)).toBeVisible();
});
```

Example API test:

```ts
import { test, expect } from '../../src/common/fixtures/test.fixture';
import { parseProduct } from '../../src/services/contracts';

test('@smoke @api product details match approved data', async ({ productsApi, testData }) => {
  const response = await productsApi.get(testData.productId);
  expect(response.status()).toBe(200);
  expect(parseProduct(await response.json()).title).toBe(testData.apiProductTitle);
});
```

Mobile projects use device/browser emulation, not physical phones or native mobile-app testing.

## Structure

```text
src/common/config/       environment and exact-host guard
src/common/fixtures/     shared typed Playwright fixtures
src/common/api/          same-origin API client
src/common/data/         approved test-data validation
src/pages/               UI Page Objects
src/services/            API services and response contracts
tests/ui/sauce-demo/     Sauce Demo UI specs
tests/ui/generic/        unauthenticated generic site-load smoke spec
tests/api/               API contract specs
tests/data/              approved synthetic expected values
.github/agents/          Planner, Generator, Reviewer, Healer
docs/                    ready-to-use agent prompt examples
```

`AGENTS.md` contains shared agent instructions and limits. See [docs/agent-prompts.md](docs/agent-prompts.md) for five simple prompts and [SECURITY.md](SECURITY.md) for safety rules. Review agent changes before accepting them.

## Reports and CI

Playwright creates HTML, JUnit, JSON, screenshots, traces, and failure videos under ignored `playwright-report/` and `test-results/`. GitHub Actions runs lint, typecheck, smoke checks on changes, and scheduled regression. The Jenkins pipeline is parameterized; configure its NodeJS tool as `Node 22` and ensure the agent has Playwright browser dependencies installed. Provide private test settings through protected Jenkins variables, never source files.
