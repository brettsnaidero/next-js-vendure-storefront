'use client';

import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { OrderByCodeQuery } from '@/providers/orders/order';
import CartContents from '@/components/cart/cart-contents';
import CartTotals from '@/components/cart/cart-totals';
import {
  OrderByCodeQuery as OrderByCodeQueryType,
  OrderByCodeQueryVariables,
} from '@/graphql-types.generated';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { useActiveOrder } from '@/utils/use-active-order';
import styles from '@/styles/pages/checkout.module.css';
import Message from '@/components/message';

const CheckoutConfirmation = ({ params }: { params: { code: string } }) => {
  const { data, error } = useSuspenseQuery<
    OrderByCodeQueryType,
    OrderByCodeQueryVariables
  >(OrderByCodeQuery, {
    variables: {
      code: params.code,
    },
  });

  const { refresh } = useActiveOrder();

  useEffect(() => {
    // Refresh the active order query/state so that the cart is reset (order has been completed)
    refresh();
  }, [refresh]);

  /*
  Important note: There's a race condition between Stripe redirecting a 
  customer to the confirmation page and the webhook receiving the confirmation 
  in the Vendure backend. As this condition is not very distinguishable from 
  other potential issues, it is currently addressed by implementing a very 
  simple retry system of 5 retries every 2.5s
  */
  const [retries, setRetries] = useState(1);

  const maxRetries = 5;
  const retriesExhausted = retries >= maxRetries;
  const retryTimeout = 2500;

  const retry = () => {
    // if (!window) return;
    // setRetries(retries + 1);
    // window.setTimeout(() => {
    //   if (retries > maxRetries) return;
    //   revalidator.revalidate();
    // }, retryTimeout);
  };

  useEffect(() => {
    // if (orderErrored) {
    //   retry();
    // }
  }, []);

  useEffect(() => {
    // if (
    //   revalidator.state === 'idle' &&
    //   orderErrored &&
    //   retries <= maxRetries &&
    //   retries > 1
    // ) {
    //   retry();
    // }
  }, []); // revalidator.state

  if (!data?.orderByCode) {
    if (error && retriesExhausted) {
      return (
        <div className={styles.confirmation}>
          <h2>An error occured</h2>

          <XCircleIcon width={20} height={20} />

          <div className={styles.block}>
            <Message
              type="error"
              text="Unfortunately your payment could not be processed or this confirmation link has expired."
            />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.confirmation}>
          <Message
            type="info"
            text="Please wait while we process your order..."
          />
        </div>
      );
    }

    return (
      <div className={styles.confirmation}>
        <Message type="info" text="No matching order found" />
      </div>
    );
  }

  return (
    <div className={styles.confirmation}>
      <h3>Order Summary</h3>

      <div className={styles.block}>
        <Message
          type="success"
          text={`Your order ${data?.orderByCode?.code} has been received!`}
          icon={<CheckCircleIcon width={20} height={20} />}
        />
      </div>

      {data?.orderByCode?.active && (
        <div className={styles.block}>
          <Message
            type="info"
            text="Note: your payment is still being processed. You will receive an email confirmation once the payment has completed."
            icon={
              <InformationCircleIcon
                aria-hidden="true"
                width={20}
                height={20}
              />
            }
          />
        </div>
      )}
      <div className={styles.block}>
        <CartContents
          orderLines={data.orderByCode.lines}
          currencyCode={data.orderByCode.currencyCode}
          editable={false}
        />
        <CartTotals order={data.orderByCode} />
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
