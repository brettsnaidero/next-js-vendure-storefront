'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import useStorage from '@/utils/sessions';
import {
  CurrencyCode,
  EligiblePaymentMethodsQuery as EligiblePaymentMethodsQueryType,
} from '@/graphql-types.generated';
import StripePayments from '@/components/checkout/stripe/stripe-payments';
import BraintreeDropIn from '@/components/checkout/braintree/braintree-payments';
import { useActiveOrder } from '@/utils/use-active-order';
import { useBraintree } from '@/utils/checkout/use-braintree';
import { useStripe } from '@/utils/checkout/use-stripe';
import { useSuspenseQuery } from '@apollo/client';
import { EligiblePaymentMethodsQuery } from '@/providers/checkout/checkout';
import { useAddPaymentToOrderData } from '@/utils/checkout/use-add-payment-to-order';
import LoadingPage from '@/components/loading';
import Message from '@/components/message';

const CheckoutPayment = () => {
  const router = useRouter();
  const { activeOrder } = useActiveOrder();

  const [processing, setProcessing] = useState(false);

  const { data, error } = useSuspenseQuery<EligiblePaymentMethodsQueryType>(
    EligiblePaymentMethodsQuery,
  );

  const { error: braintreeError, key: braintreeKey } = useBraintree({
    eligiblePaymentMethods: data?.eligiblePaymentMethods,
  });

  const {
    error: stripeError,
    key: stripeKey,
    intent: stripeIntent,
  } = useStripe({
    eligiblePaymentMethods: data?.eligiblePaymentMethods,
  });

  const { addPaymentToOrder, error: orderError } = useAddPaymentToOrderData();

  if (processing) {
    return <LoadingPage text="Processing order..." />;
  }

  // If there is no active order
  if (!activeOrder || !activeOrder.active || activeOrder.lines.length === 0) {
    router.push('/');

    return <LoadingPage />;
  }

  if (error || orderError) {
    return <Message text="Sorry, there was an error" type="error" />;
  }

  return (
    <div>
      {data?.eligiblePaymentMethods?.map((paymentMethod) =>
        paymentMethod.code.includes('braintree') && braintreeKey ? (
          <div key={paymentMethod.id}>
            {braintreeError ? (
              <div>
                <p>Braintree error:</p>
                <p>{braintreeError.message}</p>
              </div>
            ) : (
              <BraintreeDropIn
                fullAmount={activeOrder.totalWithTax ?? 0}
                currencyCode={activeOrder.currencyCode ?? CurrencyCode.Aud}
                authorization={braintreeKey}
                addPaymentToOrder={addPaymentToOrder}
                setProcessing={setProcessing}
                processing={processing}
              />
            )}
          </div>
        ) : paymentMethod.code.includes('stripe') &&
          stripeKey &&
          stripeIntent ? (
          <div key={paymentMethod.id}>
            {stripeError ? (
              <div>
                <p>Stripe error:</p>
                <p>{stripeError.message}</p>
              </div>
            ) : (
              <StripePayments
                orderCode={activeOrder.code}
                clientSecret={stripeIntent}
                publishableKey={stripeKey}
                // setProcessing={setProcessing}
                // processing={processing}
              />
            )}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default CheckoutPayment;
