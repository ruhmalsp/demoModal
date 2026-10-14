# Safety rules

- `APP_ENV=production` is rejected by the framework. Dev, QA, and staging use separate target URLs; URLs must be HTTPS and contain no embedded credentials.
- Do not put secrets in source, prompts, JSON data, screenshots, traces, reports, or logs. Keep local `.env` ignored; use protected CI variables for private credentials.
- Sauce Demo sample credentials are public demo-only values. Replace them only with approved non-production credentials, using environment-specific variables.
- Sauce Demo UI projects disable screenshots, video, and traces because the per-test authenticated fixture enters credentials. Login tests do not use authenticated fixture setup.
- Do not use real personal or payment information. Checkout examples use synthetic values and only the public practice site.
- DummyJSON write endpoints return simulated responses. Tests must not assume that a write is persistent.
- Do not use Playwright MCP against production or a target that has not been approved for the selected environment. Planner browser exploration is read-only.
- Human approval is required before changing production guards, credentials, CI secrets, destructive actions, or approved expected values. Only configure targets that are approved for the selected non-production environment.
