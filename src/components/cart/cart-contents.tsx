import Link from 'next/link';
import Price from '@/components/products/price';
import { ActiveOrderQuery, CurrencyCode } from '@/graphql-types.generated';
import Image from 'next/image';

const CartContents = ({
  orderLines,
  currencyCode,
  editable = true,
  adjustOrderLine,
  removeItem,
}: {
  orderLines: NonNullable<ActiveOrderQuery['activeOrder']>['lines'];
  currencyCode: CurrencyCode;
  editable: boolean;
  adjustOrderLine?: (lineId: string, quantity: number) => void;
  removeItem?: (lineId: string) => void;
}) => {
  const isEditable = editable !== false;

  return (
    <div>
      <ul role="list">
        {(orderLines ?? []).map((line) => (
          <li key={line.id}>
            <div>
              <Image
                src={line.featuredAsset?.preview + '?preset=thumb'}
                alt={line.productVariant.name}
              />
            </div>

            <div>
              <div>
                <div>
                  <h3>
                    <Link
                      href={`/products/${line.productVariant.product.slug}`}
                    >
                      {line.productVariant.name}
                    </Link>
                  </h3>
                  <p>
                    <Price
                      priceWithTax={line.linePriceWithTax}
                      currencyCode={currencyCode}
                    ></Price>
                  </p>
                </div>
              </div>
              <div>
                {editable ? (
                  <form>
                    <label htmlFor={`quantity-${line.id}`}>Quantity</label>
                    <select
                      disabled={!isEditable}
                      id={`quantity-${line.id}`}
                      name={`quantity-${line.id}`}
                      value={line.quantity}
                      onChange={(e) =>
                        adjustOrderLine &&
                        adjustOrderLine(line.id, +e.target.value)
                      }
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                    </select>
                  </form>
                ) : (
                  <div>
                    <span>Quantity</span>
                    <span>{line.quantity}</span>
                  </div>
                )}
                <div>
                  {isEditable && (
                    <button
                      type="submit"
                      name="removeItem"
                      value={line.id}
                      onClick={() => removeItem && removeItem(line.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartContents;
