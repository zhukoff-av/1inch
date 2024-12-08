export const urls = {
    validToken: 'https://api.1inch.dev/token/v1.2/1/custom/0x111111111117dc0aa78b770fa6a738034120c302',
    invalidToken: 'https://api.1inch.dev/token/v1.2/1/custom/0xINVALID',
};

export const expectedResponses = {
    validTokenResponse: {
        symbol: '1INCH',
        name: '1INCH Token',
        address: '0x111111111117dc0aa78b770fa6a738034120c302',
        chainId: 1,
        decimals: 18,
    },
    errorResponse: {
        error: 'Bad Request',
        message: 'Token address validation failed',
    },
};