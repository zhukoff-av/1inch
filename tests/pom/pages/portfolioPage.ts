import {expect, Locator, Page} from '@playwright/test';

export class PortfolioPage {
    readonly page: Page;
    readonly connectWalletButton: Locator;
    readonly ensInput: Locator;
    readonly ensInputSecond: Locator;
    readonly addWalletButton: Locator;
    readonly addWalletButtonSecond: Locator;
    readonly accountButtonLabel: Locator;
    readonly accountDropdown: Locator;
    readonly walletList: Locator;
    readonly walletName: Locator;
    readonly walletBalance: Locator;
    readonly cookieBanner: Locator;
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.connectWalletButton = page.getByRole('button', {name: 'Connect wallet'}).nth(1);
        this.ensInput = page.locator('input[name="address"][placeholder="Add address or domain"]').nth(0);
        this.addWalletButton = page.locator('form button.add-button').nth(0);
        this.accountButtonLabel = page.locator('app-header span.account-button-label');
        this.accountDropdown = page.getByRole('button', {name: 'vitalik.eth'});
        this.walletList = page.locator('app-bundles-dropdown .account-list').nth(0);
        this.walletName = page.locator('span.account-option-name', {hasText: 'vitalik.eth'});
        this.walletBalance = this.walletName.locator('..').locator('small.account-option-value');
        this.cookieBanner = page.locator('text="I agree"');
        this.removeButton = page.locator('div.right-hover button').nth(1)
    }

    async connectWallet() {
        await this.connectWalletButton.click();
        console.log('Connect wallet button clicked.');
    }

    // async addWallet(walletAddress: string, index: number = 0) {
    //     await this.ensInput.fill(walletAddress);
    //     await this.addWalletButton.click();
    //     console.log(`Wallet "${walletAddress}" added.`);
    // }

    async openAccountDropdown() {
        await this.accountDropdown.click();
        console.log('Account dropdown opened.');
    }

    async verifyWalletListVisible() {
        await expect(this.walletList).toBeVisible();
        console.log('Wallet list is visible.');
    }

    async verifyWalletNameAndBalance(expectedName: string, expectedBalance: string) {
        await expect(this.walletName).toContainText(expectedName);
        console.log(`Verified wallet name is "${expectedName}".`);

        await expect(this.walletBalance).toHaveText(expectedBalance);
        console.log(`Verified wallet balance is "${expectedBalance}".`);
    }

    async removeWallet(walletName: string) {
        await this.removeButton.click();
        console.log(`Removed wallet: ${walletName}`);
    }

    async verifyWalletNotInList(walletName: string) {
        const walletLocator = this.page.locator('span.account-option-name', {hasText: walletName});
        await expect(walletLocator).toHaveCount(0);
        console.log(`Verified wallet is not in the list: ${walletName}`);
    }

    async acceptCookies(page: Page) {
        try {
            await this.cookieBanner.waitFor({timeout: 10000});
            await this.cookieBanner.click();
            console.log('Cookie policy accepted.');
        } catch (error) {
            console.log('Cookie banner did not appear within 10 seconds.');
        }
    }

    async addWallet(walletAddress: string, index: number = 0) {
        const input = this.page.locator('input[name="address"][placeholder="Add address or domain"]').nth(index);
        const addButton = this.page.locator('form button.add-button').nth(index);

        await input.fill(walletAddress);
        await addButton.click();
        console.log(`Wallet "${walletAddress}" added at index ${index}.`);
    }

    async verifyWalletsVisible(walletAddresses: string[]) {
        for (const wallet of walletAddresses) {
            const walletLocator = this.walletList.locator('span.account-option-name', {hasText: wallet});
            await expect(walletLocator).toBeVisible();
            console.log(`Wallet "${wallet}" is visible.`);
        }
    }
}