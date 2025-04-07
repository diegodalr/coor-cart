import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
    storeDomain: 'https://shocoor.myshopify.com/',
    apiVersion: '2025-04',
    publicAccessToken: 'a3ffbcbf0961e44f08f41dd883dfc296',
});

export default client;