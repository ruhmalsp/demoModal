import { test, expect } from '../../../src/common/fixtures/test.fixture';

test.describe('Cart and checkout', () => {
  test('@smoke @regression demo order can be completed', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    testData
  }) => {
    await inventoryPage.addProduct(testData.productName);
    await inventoryPage.cartLink.click();
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems).toContainText(testData.productName);
    await cartPage.checkoutButton.click();
    await checkoutPage.enterCustomerDetails(testData.checkout);
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.completeHeader).toHaveText(testData.expected.checkoutComplete);
  });
});
