import {test, expect} from '@playwright/test';
import {sendGetRequest, validateResponse, measureResponseTime, validateLogoURI} from '../utils/apiHelpers';
import {urls, expectedResponses} from '../utils/testData';

test.describe('API Test: 1INCH Token Information', () => {
    test('Validate 1INCH Token API response', async ({request}) => {
        const response = await sendGetRequest(request, urls.validToken);
        await validateResponse(response, 200, expectedResponses.validTokenResponse);
        await validateLogoURI(response)
    });

    test('Validate API response time', async ({request}) => {
        const {responseTime} = await measureResponseTime(request, urls.validToken);
        console.log(`Response time: ${responseTime}ms`);
        expect(responseTime).toBeLessThan(200);
    });

    test('Validate error response for invalid token address', async ({request}) => {
        const response = await sendGetRequest(request, urls.invalidToken);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody.error).toBe('Bad Request');
        expect(responseBody.message).toContain('Token address validation failed');
    });

    test('Validate unauthorized access', async ({request}) => {
        const response = await sendGetRequest(request, urls.validToken, 'INVALID_KEY');
        expect(response.status()).toBe(401);
    });
});