import {expect, Locator, Page} from '@playwright/test';

export class PortfolioPage {
    readonly page: Page;
    readonly connectWalletButton: Locator;
    readonly ensInput: Locator;
    readonly addWalletButton: Locator;
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
    }

    async openAccountDropdown() {
        await this.accountDropdown.click();
    }

    async verifyWalletListVisible() {
        await expect(this.walletList).toBeVisible();
    }

    async verifyWalletNameAndBalance(expectedName: string, expectedBalance: string) {
        await expect(this.walletName).toContainText(expectedName);
        await expect(this.walletBalance).toHaveText(expectedBalance);
    }

    async removeWallet() {
        await this.removeButton.click();
    }

    async verifyWalletNotInList(walletName: string) {
        const walletLocator = this.page.locator('span.account-option-name', {hasText: walletName});
        await expect(walletLocator).toHaveCount(0);
    }

    async acceptCookies() {
        try {
            await this.cookieBanner.waitFor({timeout: 10000});
            await this.cookieBanner.click();
        } catch (error) {
            console.log('Cookie banner did not appear within 10 seconds. ', error);
        }
    }

    async addWallet(walletAddress: string, index: number = 0) {
        const input = this.page.locator('input[name="address"][placeholder="Add address or domain"]').nth(index);
        const addButton = this.page.locator('form button.add-button').nth(index);
        await input.fill(walletAddress);
        await addButton.click();
    }

    async verifyWalletsVisible(walletAddresses: string[]) {
        for (const wallet of walletAddresses) {
            const walletLocator = this.walletList.locator('span.account-option-name', {hasText: wallet});
            await expect(walletLocator).toBeVisible();
        }
    }
}