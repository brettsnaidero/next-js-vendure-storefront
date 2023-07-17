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
        {data.orderByCode.active ? (
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
        ) : (
          <Message
            type="success"
            text={`Your order ${data?.orderByCode?.code} has been received!`}
            icon={<CheckCircleIcon width={20} height={20} />}
          />
        )}
      </div>

      <div className={styles.block}>
        <div className={styles.information}>
          <CartContents
            orderLines={data.orderByCode.lines}
            currencyCode={data.orderByCode.currencyCode}
            editable={false}
          />
          <CartTotals order={data.orderByCode} />
        </div>
      </div>

      {data.orderByCode.shippingAddress && (
        <div className={styles.information}>
          <div className={styles.shipping}>
            <h4>Shipping address</h4>
            <div className={styles.address}>
              <div className={styles.label}>Full name</div>
              <div>{data.orderByCode.shippingAddress.fullName}</div>
              {data.orderByCode.shippingAddress.company && (
                <>
                  <div className={styles.label}>Company</div>
                  <div>{data.orderByCode.shippingAddress.company}</div>
                </>
              )}
              <div className={styles.label}>Phone</div>
              <div>{data.orderByCode.shippingAddress.phoneNumber}</div>
              <div className={styles.label}>Address</div>
              <div>
                {data.orderByCode.shippingAddress.streetLine1}
                {data.orderByCode.shippingAddress.streetLine2 ? (
                  <>
                    <br />
                    {data.orderByCode.shippingAddress.streetLine2}
                  </>
                ) : (
                  ''
                )}
              </div>
              <div className={styles.label}>City</div>
              <div>{data.orderByCode.shippingAddress.city}</div>
              <div className={styles.label}>Postcode</div>
              <div>{data.orderByCode.shippingAddress.postalCode}</div>
              <div className={styles.label}>State</div>
              <div>{data.orderByCode.shippingAddress.province}</div>
              <div className={styles.label}>Country</div>
              <div>{data.orderByCode.shippingAddress.countryCode}</div>
            </div>
          </div>
        </div>
      )}
      {/* TODO: Billing address? */}
    </div>
  );
};

export default CheckoutConfirmation;
