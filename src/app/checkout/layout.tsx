'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import CartContents from '@/components/cart/cart-contents';
import CartTotals from '@/components/cart/cart-totals';
import { useActiveOrder } from '@/utils/use-active-order';
import styles from '@/styles/pages/checkout.module.css';
import clsx from 'clsx';

const steps = [
  { name: 'Shipping', state: 'shipping' },
  { name: 'Payment', state: 'payment' },
  { name: 'Confirmation', state: 'confirmation' },
];

const Checkout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { activeOrder } = useActiveOrder();

  let state = 'shipping';
  if (pathname === '/checkout/payment') {
    state = 'payment';
  } else if (pathname.startsWith('/checkout/confirmation')) {
    state = 'confirmation';
  }

  const isConfirmationPage = state === 'confirmation';

  return (
    <div className={styles.checkout}>
      <div className={isConfirmationPage ? 'is-confirmation' : ''}>
        <h2>Checkout</h2>

        <nav aria-label="Progress" className={styles.progress}>
          <ol role="list">
            {steps.map((step, index) => {
              const active = step.state === state;
              return (
                <li
                  key={step.name}
                  className={clsx([active ? styles.active : null])}
                >
                  {active ? (
                    <span aria-current="page">{step.name}</span>
                  ) : (
                    <span>{step.name}</span>
                  )}

                  {index !== steps.length - 1 ? (
                    <ChevronRightIcon
                      aria-hidden="true"
                      width={20}
                      height={20}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={styles.layout}>
          <div className={isConfirmationPage ? 'is-confirmation' : ''}>
            {children}
          </div>

          {/* Order summary */}
          {!isConfirmationPage && activeOrder && (
            <div className={styles.summary}>
              <h3 className={styles.title}>Order summary</h3>

              <CartContents
                orderLines={activeOrder.lines}
                currencyCode={activeOrder.currencyCode}
                editable={state === 'shipping'}
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
