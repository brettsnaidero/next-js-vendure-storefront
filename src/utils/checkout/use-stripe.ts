import { useEffect } from 'react';
import {
  EligiblePaymentMethodsQuery as EligiblePaymentMethodsQueryType,
  useCreateStripePaymentIntentMutation,
} from '@/graphql-types.generated';

export const useStripe = ({
  eligiblePaymentMethods,
}: {
  eligiblePaymentMethods: EligiblePaymentMethodsQueryType['eligiblePaymentMethods'];
}) => {
  const [createStripePaymentIntent, { data, error, loading }] =
    useCreateStripePaymentIntentMutation();

  // Check which payment methods are enabled
  const stripeEnabled = eligiblePaymentMethods.find((method) =>
    method.code.includes('stripe'),
  );

  // Run the queries
  useEffect(() => {
    if (stripeEnabled && !data) {
      createStripePaymentIntent();
    }
  }, [stripeEnabled, createStripePaymentIntent, data]);

  // Get the results
  const stripePaymentIntent = data?.createStripePaymentIntent ?? undefined;
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  return {
    intent: stripePaymentIntent,
    key: stripePublishableKey,
    error,
    loading,
    data,
  };
};
