import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle = this.page.getByTestId('title');
  readonly productCards = this.page.getByTestId('inventory-item');
  readonly cartLink = this.page.getByTestId('shopping-cart-link');
  readonly sortSelect = this.page.getByTestId('product-sort-container');

  constructor(page: Page) {
    super(page);
  }

  product(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async addProduct(name: string): Promise<void> {
    await this.product(name).getByRole('button', { name: 'Add to cart' }).click();
  }
}
