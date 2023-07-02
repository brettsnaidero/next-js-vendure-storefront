import { useSuspenseQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  GenerateBraintreeClientTokenQuery,
  CreateStripePaymentIntentMutation,
  EligiblePaymentMethodsQuery,
} from '@/providers/checkout/checkout';
import { ActiveOrderQuery } from '@/providers/orders/order';
import {
  ActiveOrderQuery as ActiveOrderQueryType,
  GenerateBraintreeClientTokenQuery as GenerateBraintreeClientTokenQueryType,
  CreateStripePaymentIntentMutation as CreateStripePaymentIntentMutationType,
  EligiblePaymentMethodsQuery as EligiblePaymentMethodsQueryType,
} from '@/graphql-types.generated';
import {} from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

interface PaymentPageData {
  eligiblePaymentMethods: EligiblePaymentMethodsQueryType['eligiblePaymentMethods'];
  stripePaymentIntent: CreateStripePaymentIntentMutationType['createStripePaymentIntent'];
  stripePublishableKey: string | undefined;
  stripeError: any;
  brainTreeKey: any;
  brainTreeError: any;
  // error: any;
}

interface HookResult {
  loading: boolean;
  error?: string;
  data?: PaymentPageData;
}

export const usePaymentPageData = ({
  router,
}: {
  router: AppRouterInstance;
}): HookResult => {
  // const session = await sessionStorage.getSession(
  //   request?.headers.get('Cookie'),
  // );

  const { data } = useSuspenseQuery<ActiveOrderQueryType>(ActiveOrderQuery);

  // TODO: Make this a lazy query
  const { data: eligiblePaymentMethodsData } =
    useSuspenseQuery<EligiblePaymentMethodsQueryType>(
      EligiblePaymentMethodsQuery,
    );

  const [
    createStripePaymentIntent,
    {
      data: stripePaymentIntentResult,
      error: stripeError,
      loading: stripeLoading,
    },
  ] = useMutation<CreateStripePaymentIntentMutationType>(
    CreateStripePaymentIntentMutation,
  );
  const [
    generateBraintreeClientToken,
    {
      data: generateBrainTreeTokenResult,
      error: brainTreeError,
      loading: brainTreeLoading,
    },
  ] = useLazyQuery<GenerateBraintreeClientTokenQueryType>(
    GenerateBraintreeClientTokenQuery,
  );

  // Check if there is an active order if not redirect to homepage
  if (
    // !session ||
    !data?.activeOrder ||
    !data?.activeOrder.active ||
    data?.activeOrder.lines.length === 0
  ) {
    router.push('/');

    return {
      loading: false,
      error: 'No active order found.',
      data: undefined,
    };
  }

  // Stripe
  if (
    eligiblePaymentMethodsData?.eligiblePaymentMethods.find((method) =>
      method.code.includes('stripe'),
    )
  ) {
    createStripePaymentIntent();
  }
  const stripePaymentIntent =
    stripePaymentIntentResult?.createStripePaymentIntent ?? undefined;
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY as
    | string
    | undefined;

  // Braintree
  if (
    eligiblePaymentMethodsData?.eligiblePaymentMethods.find((method) =>
      method.code.includes('braintree'),
    )
  ) {
    generateBraintreeClientToken();
  }
  const brainTreeKey =
    generateBrainTreeTokenResult?.generateBraintreeClientToken ?? '';

  return {
    error: undefined,
    loading: stripeLoading || brainTreeLoading,
    data: {
      eligiblePaymentMethods:
        eligiblePaymentMethodsData?.eligiblePaymentMethods,
      stripePaymentIntent,
      stripePublishableKey,
      stripeError,
      brainTreeKey,
      brainTreeError,
    },
  };
};
