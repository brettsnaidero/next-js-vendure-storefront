import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, ConfigProvider, theme } from 'antd';

// import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import CartContents from '@/components/cart/cart-contents';
import Price from '@/components/products/price';
import Message from '@/components/message';
import { CurrencyCode } from '@/graphql-types.generated';
import { LinkButton } from '@/components/button';
import styles from '@/styles/components/cart.module.css';
import { ThemeContext, Theme } from '@/lib/theme-wrapper';
import { useActiveOrder } from '@/utils/use-active-order';

const CartTray = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (closed: boolean) => void;
}) => {
  const { activeOrder } = useActiveOrder();
  const currencyCode = activeOrder?.currencyCode || CurrencyCode.Aud;

  const pathname = usePathname();
  const editable = !pathname.startsWith('/checkout');

  const handleClose = () => {
    onClose(false);
  };

  const { theme: currentTheme } = useContext(ThemeContext);

  // https://ant.design/docs/react/customize-theme
  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === Theme.Light
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
      }}
    >
      <Drawer
        title="Shopping cart"
        placement="right"
        onClose={handleClose}
        open={open}
        className={styles.drawer}
      >
        <div>
          <div>
            {activeOrder?.totalQuantity ? (
              <CartContents
                orderLines={activeOrder.lines}
                currencyCode={currencyCode}
                editable={editable}
              />
            ) : (
              <Message text="Your cart is empty" />
            )}
          </div>
        </div>

        {activeOrder?.totalQuantity && editable && (
          <>
            <div className={styles.totals}>
              <div className={styles.total}>
                <h4>Subtotal</h4>
                <p>
                  {currencyCode && (
                    <Price
                      priceWithTax={activeOrder.subTotalWithTax ?? 0}
                      currencyCode={currencyCode}
                    />
                  )}
                </p>
              </div>
              <p className={styles.calculated}>
                Shipping will be calculated at checkout.
              </p>
            </div>

            <div className={styles.checkout}>
              <LinkButton
                href="/checkout"
                onClick={() => onClose(false)}
                stretch
                size="large"
                icon={<ArrowRightIcon width="20" height="20" />}
                iconPosition="right"
              >
                Checkout
              </LinkButton>
            </div>
          </>
        )}
      </Drawer>
    </ConfigProvider>
  );
};

export default CartTray;
