import { defineConfig, devices } from '@playwright/test';
import { appConfig, assertSafeExecutionEnvironment } from './src/common/config/env';

assertSafeExecutionEnvironment();

const uiTestMatch = appConfig.profile === 'sauce-demo'
  ? '**/ui/sauce-demo/**/*.spec.ts'
  : '**/ui/generic/**/*.spec.ts';
const uiDiagnostics = appConfig.profile === 'sauce-demo'
  ? { trace: 'on' as const, screenshot: 'on' as const, video: 'on' as const }
  : {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: true,
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  outputDir: 'test-results',
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
    headless: false,
  },
  projects: [
    {
      name: 'chromium',
      testMatch: uiTestMatch,
      use: { ...devices['Desktop Chrome'], ...uiDiagnostics, baseURL: appConfig.uiBaseUrl }
    },
    {
      name: 'firefox',
      testMatch: uiTestMatch,
      use: { ...devices['Desktop Firefox'], ...uiDiagnostics, baseURL: appConfig.uiBaseUrl }
    },
    {
      name: 'webkit',
      testMatch: uiTestMatch,
      use: { ...devices['Desktop Safari'], ...uiDiagnostics, baseURL: appConfig.uiBaseUrl }
    },
    {
      name: 'mobile-chrome',
      testMatch: uiTestMatch,
      use: { ...devices['Pixel 5'], ...uiDiagnostics, baseURL: appConfig.uiBaseUrl }
    },
    {
      name: 'mobile-safari',
      testMatch: uiTestMatch,
      use: { ...devices['iPhone 13'], ...uiDiagnostics, baseURL: appConfig.uiBaseUrl }
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.api.spec.ts',
      use: { baseURL: appConfig.apiBaseUrl }
    }
  ]
});
