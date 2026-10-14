import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput = this.page.getByTestId('firstName');
  readonly lastNameInput = this.page.getByTestId('lastName');
  readonly postalCodeInput = this.page.getByTestId('postalCode');
  readonly continueButton = this.page.getByTestId('continue');
  readonly finishButton = this.page.getByTestId('finish');
  readonly completeHeader = this.page.getByTestId('complete-header');

  constructor(page: Page) {
    super(page);
  }

  async enterCustomerDetails(details: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.postalCodeInput.fill(details.postalCode);
    await this.continueButton.click();
  }
}
