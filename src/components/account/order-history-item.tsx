'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { LinkButton } from '@/components/button';
import Price from '@/components/products/price';
import OrderStateBadge from '@/components/account/order-state-badge';
import Toggle from '@/components/expander';
import { ActiveCustomerOrderListQuery } from '@/graphql-types.generated';
import styles from '@/styles/components/order-history.module.css';

type OrderHistoryItemProps = {
  order?: NonNullable<
    ActiveCustomerOrderListQuery['activeCustomer']
  >['orders']['items'][number];
  areDetailsInitiallyExpanded?: boolean;
  className?: string;
};

const OrderHistoryItem = ({
  order,
  areDetailsInitiallyExpanded = false,
  className,
}: OrderHistoryItemProps) => {
  const [isLineCalcExpanded, setIsLineCalcExpanded] = useState<boolean>(false);

  return (
    <div className={clsx([className, styles.order])}>
      {/* Upper Summary */}
      <div className={styles.upper}>
        {/* Infos */}
        <ul className={styles.glance}>
          {/* Info - Date */}
          <li>
            <h4>Date placed</h4>
            <span title={new Date(order?.orderPlacedAt).toLocaleString()}>
              {order?.orderPlacedAt
                ? new Date(order.orderPlacedAt).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '--'}
            </span>
          </li>
          {/* Info - Total sum */}
          <li>
            <h4>Total sum</h4>
            <span>
              <Price
                currencyCode={order?.currencyCode}
                priceWithTax={order?.totalWithTax}
              />
            </span>
          </li>
          {/* Info - Order number */}
          <li>
            <h4>Order number</h4>
            <span>{order?.code || '--'}</span>
          </li>
        </ul>

        {/* Status */}
        <div className={styles.status}>
          <OrderStateBadge state={order?.state} />
        </div>
      </div>

      <div>
        <ul className={styles.lines}>
          {order?.lines.map((line, key) => (
            <li key={key} className={styles.product}>
              {/* Product */}
              <Link href={`/products/${line.productVariant.product.slug}`}>
                {line.featuredAsset?.source ? (
                  <Image
                    alt={line.productVariant.name}
                    src={line.featuredAsset?.source}
                    width={600}
                    height={400}
                  />
                ) : (
                  <div>No image</div>
                )}
              </Link>

              <div>
                {/* Product name */}
                <h4>
                  <Link
                    href={`/products/${line.productVariant.product.slug}`}
                    title={line.productVariant.name}
                  >
                    {line.productVariant.name}
                  </Link>
                </h4>

                {/* Price and quantity */}

                <div className={styles.price}>
                  <div>
                    {isLineCalcExpanded && (
                      <>
                        <span title="Quantity">{line.quantity}</span>{' '}
                        <span className={styles.minor}>×</span>{' '}
                        <span title="Price per unit">
                          <Price
                            currencyCode={line.productVariant.currencyCode}
                            priceWithTax={line.discountedUnitPriceWithTax}
                          />
                        </span>{' '}
                        <span className={styles.minor}>Ξ</span>{' '}
                      </>
                    )}
                    <span>
                      <Price
                        currencyCode={line.productVariant.currencyCode}
                        priceWithTax={line.discountedLinePriceWithTax}
                      />
                    </span>
                  </div>

                  <button
                    className={styles.expand}
                    type="button"
                    onClick={() => setIsLineCalcExpanded(!isLineCalcExpanded)}
                  >
                    {isLineCalcExpanded ? (
                      <MinusCircleIcon width={20} height={20} />
                    ) : (
                      <PlusCircleIcon width={20} height={20} />
                    )}
                  </button>
                </div>

                {/* Shipment status */}
                <div>
                  {line.fulfillmentLines?.reduce(
                    (acc, fLine) => acc + fLine.quantity,
                    0,
                  ) === 0
                    ? 'Not shipped yet'
                    : `${line.fulfillmentLines?.reduce(
                        (acc, fLine) => acc + fLine.quantity,
                        0,
                      )} of ${line.quantity} items fulfilled`}

                  {line.fulfillmentLines
                    ?.filter((fLine) => fLine.quantity > 0)
                    .map((fLine, key) => (
                      <span
                        key={key}
                        title={new Date(
                          fLine.fulfillment.updatedAt,
                        ).toLocaleString()}
                      >
                        {fLine.fulfillment.state}:{' '}
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                        }).format(new Date(fLine.fulfillment.updatedAt))}
                      </span>
                    ))}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Per order actions */}
        <div className={styles.bottom}>
          {order?.fulfillments?.map((fulfillment, index) => (
            <LinkButton
              href="https://auspost.com.au/mypost/track/#/search"
              key={index}
              onClick={() => {
                // TODO
                console.log(
                  `Here you'd need to link your delivery service. Tracking code for this package is "${fulfillment.trackingCode}"`,
                );
              }}
            >
              {/* Only show package number if there are more than one*/}
              Track package{' '}
              {order.fulfillments?.length == 1 ? '' : `#${index + 1}`}
            </LinkButton>
          ))}

          <Toggle title="Order summary" initial={areDetailsInitiallyExpanded}>
            {/* More details - Could be expanded with shipping adresses, payment option, etc. */}
            <div className={styles.details}>
              <div>
                <h6>Item(s) Subtotal</h6>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.subTotalWithTax}
                />
              </div>

              <div>
                <h6>Shipping & handling</h6>
                <span>
                  <Price
                    currencyCode={order?.currencyCode}
                    priceWithTax={order?.shippingLines.reduce(
                      (acc, s) => acc + s.priceWithTax,
                      0,
                    )}
                  />
                </span>
              </div>

              <div>
                <h6>Total before tax</h6>
                <span>
                  <Price
                    currencyCode={order?.currencyCode}
                    priceWithTax={order?.taxSummary.reduce(
                      (acc, t) => acc + t.taxBase,
                      0,
                    )}
                  />
                </span>
              </div>

              <div>
                <h6>Estimated tax</h6>
                <span>
                  <Price
                    currencyCode={order?.currencyCode}
                    priceWithTax={order?.taxSummary.reduce(
                      (acc, t) => acc + t.taxTotal,
                      0,
                    )}
                  />
                </span>
              </div>

              <div>
                <h6>Total</h6>
                {order?.totalWithTax && order.discounts ? (
                  <span>
                    <Price
                      currencyCode={order?.currencyCode}
                      priceWithTax={
                        order.totalWithTax -
                        order?.discounts.reduce(
                          (acc, curr) => acc + curr.amountWithTax,
                          0,
                        )
                      }
                    />
                  </span>
                ) : (
                  <span>--</span>
                )}
              </div>

              <div>
                <h6>Applied coupons</h6>
                <span>
                  <Price
                    currencyCode={order?.currencyCode}
                    priceWithTax={order?.discounts.reduce(
                      (acc, curr) => acc + curr.amountWithTax,
                      0,
                    )}
                  />
                </span>
              </div>

              <div>
                <h6>Grand total</h6>
                <span>
                  <Price
                    currencyCode={order?.currencyCode}
                    priceWithTax={order?.totalWithTax}
                  />
                </span>
              </div>
            </div>
          </Toggle>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
