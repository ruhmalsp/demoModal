import { test, expect } from '../../../src/common/fixtures/test.fixture';

test.describe('Inventory', () => {
  test('@smoke @regression inventory displays the approved product', async ({ inventoryPage, testData }) => {
    await expect(inventoryPage.pageTitle).toHaveText(testData.inventoryTitle);
    const product = inventoryPage.product(testData.productName);
    await expect(product).toBeVisible();
    await expect(product).toContainText(testData.productPrice);
    await expect(inventoryPage.productCards).toHaveCount(testData.expected.productCount);
  });

  test('@regression products can be sorted by price ascending', async ({ inventoryPage, testData }) => {
    await inventoryPage.sortSelect.selectOption('lohi');
    const prices = await inventoryPage.productCards.getByTestId('inventory-item-price').allTextContents();
    const numericPrices = prices.map((price) => Number(price.replace('$', '')));
    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
    expect(numericPrices.length).toBeGreaterThanOrEqual(testData.expected.minimumProducts);
  });
});
