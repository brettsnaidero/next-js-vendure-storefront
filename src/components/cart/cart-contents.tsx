import Link from 'next/link';
import Price from '@/components/products/price';
import Select from '@/components/form/select';
import Button from '@/components/button';
import { ActiveOrderQuery, CurrencyCode } from '@/graphql-types.generated';
import Image from 'next/image';
import { useActiveOrder } from '@/utils/use-active-order';
import styles from '@/styles/components/cart.module.css';
import { XMarkIcon } from '@heroicons/react/24/solid';

const CartContents = ({
  orderLines,
  currencyCode,
  editable = true,
}: {
  orderLines: NonNullable<ActiveOrderQuery['activeOrder']>['lines'];
  currencyCode: CurrencyCode;
  editable: boolean;
}) => {
  const { adjustItem, removeItem } = useActiveOrder();

  return (
    <div>
      <ul role="list">
        {(orderLines ?? []).map((line) => (
          <li key={line.id} className={styles.item}>
            <div className={styles.image}>
              <Image
                src={line.featuredAsset?.preview + '?preset=thumb'}
                alt={line.productVariant.name}
                width={600}
                height={400}
              />
            </div>

            <div>
              <div>
                <h4 className={styles.title}>
                  <Link href={`/products/${line.productVariant.product.slug}`}>
                    {line.productVariant.name}
                  </Link>
                </h4>
                <p className={styles.price}>
                  <Price
                    priceWithTax={line.linePriceWithTax}
                    currencyCode={currencyCode}
                  />
                </p>
              </div>
              <div>
                {editable ? (
                  <form className={styles.quantity}>
                    <label htmlFor={`quantity-${line.id}`}>Quantity</label>
                    <Select
                      disabled={!editable}
                      id={`quantity-${line.id}`}
                      name={`quantity-${line.id}`}
                      value={line.quantity}
                      onChange={(event) => {
                        // Convert value to number
                        adjustItem?.(line.id, +event.target.value);
                      }}
                      options={[1, 2, 3, 4, 5, 6, 7, 8].map((value) => ({
                        value,
                        label: `${value}`,
                      }))}
                      size="small"
                    />
                  </form>
                ) : (
                  <div className={styles.quantity}>
                    <label>Quantity</label>
                    <div>{line.quantity}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.remove}>
              {editable && (
                <button
                  type="button"
                  onClick={() => removeItem?.(line.id)}
                  className={styles.button}
                >
                  <XMarkIcon width={16} height={16} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartContents;
