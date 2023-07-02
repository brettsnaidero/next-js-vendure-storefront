'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import CartContents from '@/components/cart/cart-contents';
import CartTotals from '@/components/cart/cart-totals';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { ActiveOrderContext } from '@/lib/active-order-wrapper';

const steps = [
  { name: 'Shipping', state: 'shipping' },
  { name: 'Payment', state: 'payment' },
  { name: 'Confirmation', state: 'confirmation' },
];

const Checkout = () => {
  const pathname = usePathname();
  const outletContext = useContext(ActiveOrderContext);
  const { activeOrder, adjustOrderLine, removeItem } = outletContext;

  let state = 'shipping';
  if (pathname === '/checkout/payment') {
    state = 'payment';
  } else if (pathname.startsWith('/checkout/confirmation')) {
    state = 'confirmation';
  }
  let isConfirmationPage = state === 'confirmation';

  return (
    <div>
      <div className={isConfirmationPage ? 'is-confirmation' : ''}>
        <h2>Checkout</h2>
        <nav aria-label="Progress">
          <ol role="list">
            {steps.map((step, stepIdx) => (
              <li key={step.name}>
                {step.state === state ? (
                  <span aria-current="page">{step.name}</span>
                ) : (
                  <span>{step.name}</span>
                )}

                {stepIdx !== steps.length - 1 ? (
                  <ChevronRightIcon aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
        <div>
          <div className={isConfirmationPage ? 'is-confirmation' : ''}>
            {/* <Outlet context={outletContext} /> */}
          </div>

          {/* Order summary */}
          {!isConfirmationPage && (
            <div>
              <h2>Order summary</h2>

              <CartContents
                orderLines={activeOrder?.lines ?? []}
                currencyCode={activeOrder?.currencyCode!}
                editable={state === 'shipping'}
                removeItem={removeItem}
                adjustOrderLine={adjustOrderLine}
              />
              <CartTotals order={activeOrder} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
