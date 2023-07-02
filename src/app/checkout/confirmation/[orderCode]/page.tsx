import { useEffect, useState } from 'react';
('use client');

import { useSuspenseQuery } from '@apollo/client';
import { OrderByCodeQuery } from '@/providers/orders/order';
import CartContents from '@/components/cart/cart-contents';
import CartTotals from '@/components/cart/cart-totals';
import { OrderByCodeQuery as OrderByCodeQueryType } from '@/graphql-types.generated';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

const CheckoutConfirmation = ({
  params,
}: {
  params: { orderCode: string };
}) => {
  const { data, error } = useSuspenseQuery<OrderByCodeQueryType>(
    OrderByCodeQuery,
    {
      variables: {
        code: params.orderCode,
      },
    },
  );

  const [retries, setRetries] = useState(1);

  const orderNotFound = !data?.orderByCode && !error;
  const orderErrored = !data?.orderByCode && error;
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

  if (orderNotFound) {
    return (
      <div>
        <h2>No matching order found!</h2>
      </div>
    );
  }

  if (orderErrored && retriesExhausted) {
    return (
      <div>
        <h2>
          <XCircleIcon></XCircleIcon>
          <span>An error occured!</span>
        </h2>
        <p>
          Unfortunately your payment could not be processed or this confirmation
          link has expired.
        </p>
      </div>
    );
  }

  if (orderErrored) {
    return (
      <div>
        <h2>Please wait while we process your order...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>
        <CheckCircleIcon></CheckCircleIcon>
        <span>Order Summary</span>
      </h2>
      <p>
        Your order <span>{data?.orderByCode?.code}</span> has been received!
      </p>
      {data?.orderByCode?.active && (
        <div>
          <div>
            <div>
              <InformationCircleIcon aria-hidden="true" />
            </div>
            <div>
              <p>
                {' '}
                Note: your payment is still being processed. You will receive an
                email confirmation once the payment has completed.
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        <div>
          <CartContents
            orderLines={data?.orderByCode?.lines}
            currencyCode={data?.orderByCode?.currencyCode}
            editable={false}
          />
        </div>
        <CartTotals order={data?.orderByCode} />
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
