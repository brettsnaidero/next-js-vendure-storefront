import Price from '@/components/products/price';
import { OrderDetailFragment } from '@/graphql-types.generated';
import styles from '@/styles/components/cart.module.css';

const CartTotals = ({ order }: { order?: OrderDetailFragment | null }) => (
  <dl className={styles.totals}>
    <div className={styles.total}>
      <dt>Subtotal</dt>
      <dd>
        <Price
          priceWithTax={order?.subTotalWithTax}
          currencyCode={order?.currencyCode}
        />
      </dd>
    </div>
    <div className={styles.total}>
      <dt>Shipping</dt>
      <dd>
        <Price
          priceWithTax={order?.shippingWithTax ?? 0}
          currencyCode={order?.currencyCode}
        />
      </dd>
    </div>
    <div className={styles.total}>
      <dt>Total</dt>
      <dd>
        <Price
          priceWithTax={order?.totalWithTax}
          currencyCode={order?.currencyCode}
        />
      </dd>
    </div>
  </dl>
);

export default CartTotals;
