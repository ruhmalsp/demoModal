import type { Page } from '@playwright/test';
import { url } from '../../utils/pageBank';


export class ParaBankPO {
   readonly page: Page
   readonly mainPageLoc: string;
   readonly mainPageTitleTextLoc: string;
   readonly registerLinkLoc: string;
   readonly registerPageTitleLoc: string;
   readonly registerBtnLoc: string;
   readonly mainPageTitle: any;

   constructor(page: Page) {
      this.page = page
      this.mainPageLoc = "#mainPanel"
      this.mainPageTitleTextLoc = "//div[@id='mainPanel']//img[@alt='ParaBank']"
      this.registerLinkLoc = "//div[@id='loginPanel']//a[text() ='Register']"
      this.registerPageTitleLoc = "//div[@id='rightPanel']//h1[@class='title' and text() ='Signing up is easy!']"
      this.registerBtnLoc = "//*[@id='customerForm']//input[@value='Register' and @type ='submit']"
      this.mainPageTitle = (pageTitle: any) => { return `//div[@id='mainPanel']//img[@title='${pageTitle}']` };
   }

   async navigate() {
      await this.page.goto(url);
      await this.page.waitForSelector(this.mainPageLoc);
   }

   async isPageTitleVisible(pageTitle: string) {
      await this.page.waitForSelector(this.mainPageLoc);
      return await this.page.locator(this.mainPageTitle(pageTitle)).isVisible();
   }

   async getPageTitle() {
      await this.page.waitForSelector(this.mainPageLoc);
      return await this.page.locator(this.mainPageTitleTextLoc).getAttribute("title");
   }

   async clickOnRegisterLink() {
      await this.page.waitForSelector(this.registerLinkLoc);
      return await this.page.locator(this.registerLinkLoc).click({ force: true });
   }

   async enterTheFormDetiles(labelName: string, data: string) {
      await this.page.waitForSelector(this.registerPageTitleLoc);
      switch (labelName) {
         // case "firstName":
         case "firstName":
            await this.page.locator('#customerForm input[id ="customer.firstName"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.firstName"]').fill(data);
            break;

         case 'lastName':
            await this.page.locator('#customerForm input[id ="customer.lastName"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.lastName"]').fill(data);
            break;

         case 'address':
            await this.page.locator('#customerForm input[id ="customer.address.street"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.address.street"]').fill(data);
            break;

         case 'city':
            await this.page.locator('#customerForm input[id ="customer.address.city"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.address.city"]').fill(data);
            break;

         case 'state':
            await this.page.locator('#customerForm input[id ="customer.address.state"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.address.state"]').fill(data);
            break;

         case 'zipCode':
            await this.page.locator('#customerForm input[id ="customer.address.zipCode"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.address.zipCode"]').fill(data);
            break;

         case 'phoneNumber':
            await this.page.locator('#customerForm input[id ="customer.phoneNumber"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.phoneNumber"]').fill(data);
            break;

         case 'ssn':
            await this.page.locator('#customerForm input[id ="customer.ssn"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.ssn"]').fill(data);
            break;

         case 'username':
            await this.page.locator('#customerForm input[id ="customer.username"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.username"]').fill(data);
            break;

         case 'password':
            await this.page.locator('#customerForm input[id ="customer.password"]').fill("");
            await this.page.locator('#customerForm input[id ="customer.password"]').fill(data);
            break;

         case 'repeatedPassword':
            await this.page.locator('#customerForm input[id ="repeatedPassword"]').fill("");
            await this.page.locator('#customerForm input[id ="repeatedPassword"]').fill(data);
            break;

         default:
            console.log("*********NO Label Found************")
      }
   }


   async clickOnRegisterBtn() {
      await this.page.waitForSelector(this.registerBtnLoc);
      await this.page.locator(this.registerBtnLoc).click({ force: true });
      await this.page.waitForSelector("//div[@id='rightPanel']//h1[@class='title']");
      (await this.page.waitForSelector("//div[@id='rightPanel']//h1[@class='title']")).waitForElementState("stable");
      (await this.page.waitForSelector("//div[@id='rightPanel']//h1[@class='title']")).waitForElementState("visible");
   }

   async getWelcomeTitle() {
      await this.page.waitForSelector("//div[@id='rightPanel']//h1[@class='title']");
      return await this.page.locator("//div[@id='rightPanel']//h1[@class='title']").textContent();
   }


   async getWelcomeMessage() {
      await this.page.waitForSelector("#rightPanel p");
      return await this.page.locator("#rightPanel p").textContent();
   }

   async clickOnAccountsOverviewTab() {
      await this.page.waitForSelector("//div[@id='leftPanel']//a[text() ='Accounts Overview']");
      await this.page.locator("//div[@id='leftPanel']//a[text() ='Accounts Overview']").click({ force: true });
   }

   async getAccountIDFormTable() {
      await this.page.waitForSelector("#accountTable a");
      const accountID: any = await this.page.locator("#accountTable a").textContent();
      return JSON.parse(accountID)
   }

   async clickAccountIDFormTable() {
      await this.page.waitForSelector("#accountTable a");
      await this.page.locator("#accountTable a").click({ force: true });
      await this.page.waitForSelector("//div[@id='accountDetails']//h1[@class ='title' and text() = 'Account Details']");
   }

   async getTransactionModeMessage() {
      await this.page.waitForSelector("//div[@id='accountDetails']//h1[@class ='title' and text() = 'Account Details']");
      return await this.page.locator("#transactionTable a").textContent()
   }

   async getTransactionAmount() {
      await this.page.waitForSelector("//div[@id='accountDetails']//h1[@class ='title' and text() = 'Account Details']");
      return await this.page.locator(`//*[@id ='transactionTable']//td [contains(text(),'$')]`).textContent();
   }

   async clickOnTransferFundsTab() {
      await this.page.waitForSelector("//div[@id='leftPanel']//a[text() ='Transfer Funds']");
      await this.page.locator("//div[@id='leftPanel']//a[text() ='Transfer Funds']").click({ delay: 2000 });
      await this.page.waitForTimeout(3000);
   }

   async fillTransferAmount(amount) {
      await this.page.waitForSelector("#transferForm input#amount");
      await this.page.locator('#transferForm input#amount').fill("");
      await this.page.locator('#transferForm input#amount').fill(JSON.stringify(amount));
   }

   async clickOnTransferBtn() {
      await this.page.waitForSelector("#transferForm input[value='Transfer']");
      await this.page.locator("#transferForm input[value='Transfer']").click({ force: true });
      await this.page.waitForSelector("//h1[@class='title' and text() ='Transfer Complete!']");
   }

   async getTransactionAmountMessage() {
      await this.page.waitForSelector("//h1[@class='title' and text() ='Transfer Complete!']");
      const results = await this.page.locator(`#showResult p`).nth(0).innerText();
      console.log(results);
      return results;
   }

   async getTransactionAllModeMessage() {
      await this.page.waitForTimeout(1000);
      await this.page.waitForSelector("//div[@id='accountDetails']//h1[@class ='title' and text() = 'Account Details']");
      return await this.page.locator("#transactionTable a").allInnerTexts()
   }
}