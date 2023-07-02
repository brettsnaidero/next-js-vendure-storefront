import Price from '@/components/products/price';
import { OrderDetailFragment } from '@/graphql-types.generated';

const CartTotals = ({ order }: { order?: OrderDetailFragment | null }) => (
  <dl>
    <div>
      <dt>Subtotal</dt>
      <dd>
        <Price
          priceWithTax={order?.subTotalWithTax}
          currencyCode={order?.currencyCode}
        ></Price>
      </dd>
    </div>
    <div>
      <dt>Shipping</dt>
      <dd>
        <Price
          priceWithTax={order?.shippingWithTax ?? 0}
          currencyCode={order?.currencyCode}
        ></Price>
      </dd>
    </div>
    <div>
      <dt>Total</dt>
      <dd>
        <Price
          priceWithTax={order?.totalWithTax}
          currencyCode={order?.currencyCode}
        ></Price>
      </dd>
    </div>
  </dl>
);

export default CartTotals;
