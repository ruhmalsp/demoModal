import { test as base, expect, type Page } from '@playwright/test';
import { BaseApiClient } from '../api/BaseApiClient';
import { appConfig, getDemoCredentials } from '../config/env';
import { testData, type DemoTestData } from '../data/testData';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { GenericHomePage } from '../../pages/GenericHomePage';
import { ProductsApi } from '../../services/ProductsApi';

interface FrameworkFixtures {
  loginPage: LoginPage;
  genericHomePage: GenericHomePage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
  apiClient: BaseApiClient;
  productsApi: ProductsApi;
  testData: DemoTestData;
}

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  genericHomePage: async ({ page }, use) => use(new GenericHomePage(page)),
  authenticatedPage: async ({ page, loginPage }, use) => {
    if (appConfig.profile !== 'sauce-demo') {
      throw new Error('The authenticatedPage fixture is available only to the sauce-demo profile.');
    }
    const credentials = getDemoCredentials();
    await loginPage.open('/');
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/inventory\.html$/);
    await use(page);
  },
  inventoryPage: async ({ authenticatedPage }, use) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.open('/inventory.html');
    await use(inventoryPage);
  },
  cartPage: async ({ authenticatedPage }, use) => {
    await use(new CartPage(authenticatedPage));
  },
  checkoutPage: async ({ authenticatedPage }, use) => {
    await use(new CheckoutPage(authenticatedPage));
  },
  apiClient: async ({ request }, use) => use(new BaseApiClient(request, appConfig.apiBaseUrl)),
  productsApi: async ({ apiClient }, use) => use(new ProductsApi(apiClient)),
  testData: async ({}, use) => use(testData)
});

export { expect };
