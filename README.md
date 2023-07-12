# Next.js / Vendure storefront

An e-commerce storefront for [Vendure](https://www.vendure.io/) built with [Next.js](https://nextjs.org/).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Dependencies / technologies

- [Typescript](https://www.typescriptlang.org/)
- [Apollo](https://www.apollographql.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Ant design](https://ant.design/)

## Styling

Styling for the project uses PostCSS and CSS Modules.

## Getting Started

Create a `.env` file in the root dir with the following contents:

```.env
NEXT_PUBLIC_VENDURE_SHOP_API=http://localhost:3001/shop-api
# or
# NEXT_PUBLIC_VENDURE_SHOP_API=https://readonlydemo.vendure.io/shop-api
AUTH_TOKEN_KEY=
COOKIE_SESSION_SECRET=
STRIPE_PUBLISHABLE_KEY=
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Generating types

To generate Typescript types from the Vendure GraphQL API, you can run:

```bash
npm run generate-types
# or
yarn generate-types
# or
pnpm generate-types
```

Generated types will then be available in the `graphql-types.generates.ts` file.

## Payments

### Stripe integration

This repo has a built-in Stripe payment integration. To enable it, ensure that your Vendure server is set up with the [StripePlugin](https://docs.vendure.io/typescript-api/core-plugins/payments-plugin/stripe-plugin/).

Ensure your new PaymentMethod uses the word `stripe` somewhere in its code, as that's how this integration will know to load the Stripe payment element.

Then add your Stripe publishable key to the env file:

```
STRIPE_PUBLISHABLE_KEY=pk_test_t38hl...etc
```

Important note: There's a race condition between Stripe redirecting a customer to the confirmation page and the webhook receiving the confirmation in the Vendure backend. As this condition is not very distinguishable from other potential issues, it is currently addressed by implementing a very simple retry system of 5 retries every 2.5s You can tweak these settings in the CheckoutConfirmation component.

## Braintree integration

This repo has built-in Braintree integration. To enable it, ensure that your Vendure server is set up with the [BraintreePlugin](https://docs.vendure.io/typescript-api/core-plugins/payments-plugin/braintree-plugin/).

Currently, `storeCustomersInBraintree` has to be set to `true` in plugin options. Enabling this plugin with this setting on will require a database migration / synchronization.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## To do

Here are some things which could be improved:

- Metadata generation for pages (eg. page title and description)
- Audit and consolidate data fetching (eg. using GraphQL fragments to minimise requests)
