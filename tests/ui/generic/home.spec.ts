import { test, expect } from '../../../src/common/fixtures/test.fixture';

test('the configured application home page loads @smoke @regression', async ({ page, genericHomePage }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await expect(genericHomePage.documentBody).toBeVisible();
});
