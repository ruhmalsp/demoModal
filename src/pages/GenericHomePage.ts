import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GenericHomePage extends BasePage {
  readonly documentBody: Locator;

  constructor(page: Page) {
    super(page);
    this.documentBody = page.locator('body');
  }
}
