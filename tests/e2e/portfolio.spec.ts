import {test, expect} from '@playwright/test';
import {PortfolioPage} from '../pom/pages/portfolioPage';

test.describe('Portfolio Wallet Management', () => {
    let portfolio: PortfolioPage;
    const wallet1 = 'vitalik.eth';
    const wallet2 = 'address.eth';

    test.beforeEach(async ({page}) => {
        portfolio = new PortfolioPage(page);
        await page.goto('https://portfolio.1inch.io/');
    });

    test('Add ENS Wallet and Validate Responses', async ({page}) => {
        await portfolio.connectWallet();

        await portfolio.addWallet(wallet1);

        // Validate ENS Request
        const [ensRequest] = await Promise.all([
            page.waitForResponse((response) =>
                response.url().includes('https://domains.1inch.io/v2.0/lookup?name=vitalik.eth') &&
                response.status() === 200
            ),
        ]);
        const ensResponseBody = await ensRequest.json();
        expect(ensResponseBody).toEqual({
            result: [
                {
                    protocol: 'ENS',
                    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
                    checkUrl: 'https://app.ens.domains/vitalik.eth',
                },
            ],
        });

        // Validate Portfolio API Request
        const [portfolioRequest] = await Promise.all([
            page.waitForResponse((response) =>
                response.url().includes(
                    'https://portfolio-api.1inch.io/portfolio/v4/general/current_value?addresses=0xd8da6bf26964af9d7eed9e03e53415d37aa96045&use_cache=true'
                ) && response.status() === 200
            ),
        ]);
        const portfolioResponseBody = await portfolioRequest.json();
        const valueUsd = portfolioResponseBody.result[0].value_usd;
        const formattedValueUsd = ` $${Math.round(valueUsd).toLocaleString('fr-FR')}`;

        // Check wallet was added successfully in header.
        await expect(portfolio.accountButtonLabel).toContainText(wallet1);

        await portfolio.openAccountDropdown();

        // Check wallet was added to the wallets list.
        await portfolio.verifyWalletListVisible();
        await portfolio.verifyWalletNameAndBalance(wallet1, formattedValueUsd);
    });

    // OPTIONAL SCENARIOS
    test('Remove wallet address from the list', async ({page}) => {
        await portfolio.connectWallet();

        await portfolio.addWallet(wallet1);
        console.log(`Added wallet: ${wallet1}`);

        await portfolio.openAccountDropdown();
        await portfolio.removeWallet(wallet1);

        await portfolio.verifyWalletNotInList(wallet1);
    });

    test('Verify wallet cache persists after page refresh', async ({page}) => {
        await portfolio.connectWallet();

        await portfolio.addWallet(wallet1, 0);
        console.log(`Added wallet: ${wallet1}`);
        await expect(portfolio.accountButtonLabel).toContainText(wallet1);

        await page.reload({timeout: 5000});
        await expect(portfolio.accountButtonLabel).toContainText(wallet1);
    })


    test('Add two wallet addresses and verify visibility', async ({page}) => {
        await portfolio.acceptCookies(page);
        await portfolio.connectWallet();

        await portfolio.addWallet(wallet1);

        const headerDropdown = page.getByRole('button', {name: wallet1});
        await headerDropdown.click();

        await portfolio.addWallet(wallet2, 1);

        await portfolio.verifyWalletsVisible([wallet1, wallet2]);

        console.log('Both wallets are visible in the list.');
    });

    // Check the link. redirect to the portfolio

    // Check invalid
});