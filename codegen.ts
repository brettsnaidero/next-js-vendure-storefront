import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const vendureApi = process.env.NEXT_PUBLIC_VENDURE_SHOP_API as string;

const config: CodegenConfig = {
  schema: [
    {
      [vendureApi]: {
        headers: {
          // 'X-Shopify-Storefront-Access-Token': publicStorefrontToken,
        },
      },
    },
    // This is the additional schema extension that would be present it
    // the Stripe playment plugin is enabled on the Vendure server. Added
    // manually here to allow codegen to work regardless.
    'type Mutation { createStripePaymentIntent: String }',
    // This is the additional schema extension that would be present it
    // the Braintree playment plugin is enabled on the Vendure server. Added
    // manually here to allow codegen to work regardless.
    'type Query { generateBraintreeClientToken: String }',
  ],
  documents: ['**/*.{ts,tsx}'],
  // hooks: {
  //   afterAllFileWrite: ['prettier --write'],
  // },
  generates: {
    './src/graphql-types.generated.ts': {
      config: {},
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};

export default config;
