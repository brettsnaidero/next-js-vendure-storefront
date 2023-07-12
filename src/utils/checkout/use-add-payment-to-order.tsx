import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import {
  NextOrderStatesQuery as NextOrderStatesQueryType,
  useAddPaymentToOrderMutation,
  useTransitionOrderToStateMutation,
} from '@/graphql-types.generated';
import { NextOrderStatesQuery } from '@/providers/checkout/checkout';

/*
There is some complexity to adding payment information to an order. The order
must be in the ArrangingPayment state before payment information can be added.
This hook checks the current order state and transitions the order to the
ArrangingPayment state if necessary. Then it will add the payment information
to the order.
*/
export const useAddPaymentToOrderData = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const [moveToAddPaymentToOrder, setMoveToAddPaymentToOrder] = useState(false);

  const [paymentMethodCode, setPaymentCode] = useState<
    'braintree' | 'stripe'
  >();
  const [paymentNonce, setPaymentNonce] = useState<string>();

  // Queries & Mutations
  const [getNextOrderStates, { data: nextOrderStatesData }] =
    useLazyQuery<NextOrderStatesQueryType>(NextOrderStatesQuery);
  const [transitionOrderToState, { data: transitionResult }] =
    useTransitionOrderToStateMutation();

  const [addPaymentToOrder, { loading }] = useAddPaymentToOrderMutation();

  const kickOff = (code: 'braintree' | 'stripe', nonce: string) => {
    setPaymentCode(code);
    setPaymentNonce(nonce);

    getNextOrderStates();
  };

  useEffect(() => {
    // If the order is not in the ArrangingPayment state, we need transition it to that state
    if (nextOrderStatesData?.nextOrderStates?.includes('ArrangingPayment')) {
      transitionOrderToState({
        variables: {
          state: 'ArrangingPayment',
        },
      });
    }

    setMoveToAddPaymentToOrder(true);
  }, [nextOrderStatesData, transitionOrderToState]);

  useEffect(() => {
    if (transitionResult?.transitionOrderToState?.__typename === 'Order') {
      // Add payment to order
      addPaymentToOrder({
        variables: {
          input: {
            method: paymentMethodCode as string,
            metadata: { nonce: paymentNonce },
          },
        },
      })
        .then(({ data }) => {
          if (data?.addPaymentToOrder.__typename === 'Order') {
            console.log(
              'Redirecting to',
              `/checkout/confirmation/${data?.addPaymentToOrder.code}`,
            );
            // Redirect to confirmation page
            router.push(
              `/checkout/confirmation/${data?.addPaymentToOrder.code}`,
            );
          } else if (data?.addPaymentToOrder) {
            // If operation had some error, return it
            setError(data?.addPaymentToOrder?.message);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    } else if (
      transitionResult?.transitionOrderToState?.__typename ===
      'OrderStateTransitionError'
    ) {
      // If order is not found, show error
      setError(transitionResult.transitionOrderToState.message);
    }
  }, [transitionResult]);

  return {
    // Kick off this hook by calling getNextOrderStates will check the current order state
    addPaymentToOrder: kickOff,
    loading,
    error,
  };
};
