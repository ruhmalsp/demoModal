import { test, expect } from '../../../src/common/fixtures/test.fixture';
import { getDemoCredentials } from '../../../src/common/config/env';

test.describe('Authentication', () => {
  test('@smoke @regression @negative invalid password is rejected', async ({ loginPage, testData }) => {
    const credentials = getDemoCredentials();
    await loginPage.open('/');
    await loginPage.login(credentials.username, `${credentials.password}-invalid`);
    await expect(loginPage.errorMessage).toContainText(testData.expected.loginError);
  });

  test('@regression @negative locked account is rejected', async ({ loginPage, testData }) => {
    const credentials = getDemoCredentials();
    await loginPage.open('/');
    await loginPage.login(credentials.lockedUsername, credentials.password);
    await expect(loginPage.errorMessage).toContainText(testData.expected.lockedLoginError);
  });
});
