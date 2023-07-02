'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useLazyQuery } from '@apollo/client';
// import useStorage from '@/utils/sessions';
import {
  AddPaymentToOrderMutation as AddPaymentToOrderMutationType,
  CurrencyCode,
  ErrorCode,
  ErrorResult,
  NextOrderStatesQuery as NextOrderStatesQueryType,
  TransitionOrderToStateMutation as TransitionOrderToStateMutationType,
} from '@/graphql-types.generated';
import { StripePayments } from '@/components/checkout/stripe/stripe-payments';
import DummyPayments from '@/components/checkout/dummy-payments';
import { BraintreeDropIn } from '@/components/checkout/braintree/braintree-payments';
import { ActiveOrderContext } from '@/lib/active-order-wrapper';
import { usePaymentPageData } from '@/utils/use-payment-page-data';
import {
  AddPaymentToOrderMutation,
  NextOrderStatesQuery,
  TransitionOrderToStateMutation,
} from '@/providers/checkout/checkout';

function getPaymentError(error?: ErrorResult): string | undefined {
  if (!error || !error.errorCode) {
    return undefined;
  }
  switch (error.errorCode) {
    case ErrorCode.OrderPaymentStateError:
    case ErrorCode.IneligiblePaymentMethodError:
    case ErrorCode.PaymentFailedError:
    case ErrorCode.PaymentDeclinedError:
    case ErrorCode.OrderStateTransitionError:
    case ErrorCode.NoActiveOrderError:
      return error.message;
  }
}

const CheckoutPayment = () => {
  const router = useRouter();
  const { data, loading, error } = usePaymentPageData({ router }) || {};

  const {
    eligiblePaymentMethods,
    stripePaymentIntent,
    stripePublishableKey,
    stripeError,
    brainTreeKey,
    brainTreeError,
  } = data ?? {};
  const { activeOrderFetcher, activeOrder } = useContext(ActiveOrderContext);
  const [addPaymentToOrder, { data: addPaymentToOrderData }] =
    useMutation<AddPaymentToOrderMutationType>(AddPaymentToOrderMutation);
  const [getNextOrderStates] =
    useLazyQuery<NextOrderStatesQueryType>(NextOrderStatesQuery);
  const [transitionOrderToState] =
    useLazyQuery<TransitionOrderToStateMutationType>(
      TransitionOrderToStateMutation,
    );

  const paymentError = 'Error'; // getPaymentError(error);

  const submitForm = async ({ paymentMethodCode, paymentNonce }) => {
    if (typeof paymentMethodCode === 'string') {
      const { data: nextOrderStates } = await getNextOrderStates();

      if (nextOrderStates?.nextOrderStates?.includes('ArrangingPayment')) {
        const { data: transitionResult } = await transitionOrderToState({
          variables: { state: 'ArrangingPayment' },
        });

        if (transitionResult?.transitionOrderToState?.__typename !== 'Order') {
          // throw new Response('Not Found', {
          //   status: 400,
          //   statusText: transitionResult?.transitionOrderToState?.message,
          // });
        }
      }

      addPaymentToOrder({
        variables: {
          method: paymentMethodCode,
          metadata: { nonce: paymentNonce },
        },
      });
    }
  };

  if (addPaymentToOrderData?.addPaymentToOrder.__typename === 'Order') {
    return router.push(
      `/checkout/confirmation/${addPaymentToOrderData.addPaymentToOrder.code}`,
    );
  }

  // if (addPaymentToOrderData?.addPaymentToOrder.__typename !== 'OrderError') {
  // throw new Response('Not Found', {
  //   status: 400,
  //   statusText: result.addPaymentToOrder?.message,
  // });
  // }

  return (
    <div>
      {eligiblePaymentMethods?.map((paymentMethod) =>
        paymentMethod.code.includes('braintree') ? (
          <div key={paymentMethod.id}>
            {brainTreeError ? (
              <div>
                <p>Braintree error:</p>
                <p>{brainTreeError}</p>
              </div>
            ) : (
              <BraintreeDropIn
                fullAmount={activeOrder?.totalWithTax ?? 0}
                currencyCode={
                  activeOrder?.currencyCode ?? ('USD' as CurrencyCode)
                }
                show={true}
                authorization={brainTreeKey!}
              />
            )}
          </div>
        ) : paymentMethod.code.includes('stripe') ? (
          <div key={paymentMethod.id}>
            {stripeError ? (
              <div>
                <p>Stripe error:</p>
                <p>{stripeError}</p>
              </div>
            ) : (
              <StripePayments
                orderCode={activeOrder?.code ?? ''}
                clientSecret={stripePaymentIntent!}
                publishableKey={stripePublishableKey!}
              />
            )}
          </div>
        ) : (
          <div key={paymentMethod.id}>
            <DummyPayments
              paymentMethod={paymentMethod}
              paymentError={paymentError}
            />
          </div>
        ),
      )}
    </div>
  );
};

export default CheckoutPayment;
