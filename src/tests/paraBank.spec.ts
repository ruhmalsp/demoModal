import { test, expect } from '@playwright/test';
import { ParaBankPO } from '../pages/index';
import moment from 'moment';
let paraBankPO: ParaBankPO, accountID: number
const userName = `Prasad${moment().valueOf().toString()}`;
const phoneNumber = Math.floor(Math.random() * 10000000000).toString();
const message = "Your account was created successfully. You are now logged in.";

test('Verify and Navigate to the target page', async ({ page, request }) => {
    paraBankPO = new ParaBankPO(page);
    await paraBankPO.navigate()
    const isPageTitlePresent: boolean = await paraBankPO.isPageTitleVisible("ParaBank");
    expect(isPageTitlePresent).toBeTruthy();
    const PageTitleText: any = await paraBankPO.getPageTitle();
    expect(PageTitleText.trim()).toEqual("ParaBank");


    await test.step('Click on Register button and fill the required fields', async () => {
        await paraBankPO.clickOnRegisterLink();
        await paraBankPO.enterTheFormDetiles('firstName', "Prasad");
        await paraBankPO.enterTheFormDetiles('lastName', "R");
        await paraBankPO.enterTheFormDetiles('address', "VarahaLayout");
        await paraBankPO.enterTheFormDetiles('city', "Benguluru");
        await paraBankPO.enterTheFormDetiles('state', "Karnataka");
        await paraBankPO.enterTheFormDetiles('zipCode', "560106");
        await paraBankPO.enterTheFormDetiles('phoneNumber', phoneNumber);
        await paraBankPO.enterTheFormDetiles('ssn', "1825");
        await paraBankPO.enterTheFormDetiles('username', userName);
        await paraBankPO.enterTheFormDetiles('password', "Prasad@12345678");
        await paraBankPO.enterTheFormDetiles('repeatedPassword', "Prasad@12345678");
        await paraBankPO.clickOnRegisterBtn();
        const welcomeTitle: any = await paraBankPO.getWelcomeTitle();
        expect(welcomeTitle.trim()).toEqual(`Welcome ${userName}`);
        const welcomeMessage: any = await paraBankPO.getWelcomeMessage();
        expect(welcomeMessage.trim()).toEqual(message);
    });

    await test.step('Verify the response code and the message and transaction data', async () => {
        await paraBankPO.clickOnAccountsOverviewTab();
        accountID = await paraBankPO.getAccountIDFormTable();
        const amount = 100.00;
        const res = await request.post(`https://parabank.parasoft.com/parabank/services/bank/deposit?accountId=${accountID}&amount=${amount}`);
        console.log('res', res);
        expect(res.status()).toEqual(200);
        await paraBankPO.clickOnAccountsOverviewTab();
        await paraBankPO.clickAccountIDFormTable();
        const transactionMessage: any = await paraBankPO.getTransactionModeMessage();
        expect(transactionMessage.trim()).toEqual("Deposit via Web Service");
        const transactionAmount: any = await paraBankPO.getTransactionAmount();
        expect(transactionAmount.trim()).toContain(`$${amount}`);
        await paraBankPO.clickOnTransferFundsTab();
        await paraBankPO.fillTransferAmount(amount);
        await paraBankPO.clickOnTransferBtn();
        const transferSuccessesMessage = await paraBankPO.getTransactionAmountMessage();
        expect(transferSuccessesMessage.trim()).toEqual(`$100.00 has been transferred from account #${accountID} to account #${accountID}.`);
        const getRes: any = await request.get(`https://parabank.parasoft.com/parabank/services/bank/accounts/${accountID}/transactions`);
        expect(getRes.status()).toEqual(200);
        await paraBankPO.clickOnAccountsOverviewTab();
        await paraBankPO.clickAccountIDFormTable();
        const transactionMessage1 = await paraBankPO.getTransactionAllModeMessage()
        expect(transactionMessage1[0].trim()).toEqual("Deposit via Web Service");
        expect(transactionMessage1[1].trim()).toEqual("Funds Transfer Sent");
        expect(transactionMessage1[2].trim()).toEqual("Funds Transfer Received");
    });
});
