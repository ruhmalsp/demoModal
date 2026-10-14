import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems = this.page.getByTestId('inventory-item');
  readonly checkoutButton = this.page.getByTestId('checkout');

  constructor(page: Page) {
    super(page);
  }
}
