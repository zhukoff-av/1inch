import {APIRequestContext, expect} from '@playwright/test';
import {API_KEY} from './envConfig';
import fetch from 'node-fetch'

export const sendGetRequest = async (request: APIRequestContext, url: string, token: string = API_KEY) => {
    const [response] = await Promise.all([request.get(url, {
        headers: {Authorization: `Bearer ${token}`},
    })]);
    return response;
};

export const validateResponse = async (response: any, expectedStatus: number, expectedBody: object) => {
    expect(response.status()).toBe(expectedStatus);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(expectedBody);
};

export const validateLogoURI = async (response: any) => {
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('logoURI');
    const logoURI = responseBody.logoURI;

    console.log(logoURI)

    // Basic validation for URL format
    expect(logoURI).toMatch(/^https?:\/\/.+/);

    const fetchWithTimeout = async (url: string, timeout: number) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const res = await fetch(url, {signal: controller.signal});
            clearTimeout(timeoutId);
            return res;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request to ${url} timed out after ${timeout}ms`);
            }
            throw error;
        }
    };

    // Check if the URL is accessible with a timeout of 5000ms (5 seconds)
    try {
        const logoResponse = await fetchWithTimeout(logoURI, 5000);
        expect(logoResponse.ok).toBe(true); // Ensure HTTP status is 200-299
        console.log(`Logo URI ${logoURI} is accessible.`);
    } catch (error) {
        console.error(`Failed to validate logo URI: ${error.message}`);
        throw error; // Re-throw the error to fail the test
    }
}
export const measureResponseTime = async (request: APIRequestContext, url: string, token: string = API_KEY) => {
    const startTime = Date.now();
    const response = await sendGetRequest(request, url, token);
    const endTime = Date.now();
    return {response, responseTime: endTime - startTime};
};