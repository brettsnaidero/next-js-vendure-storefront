'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/button';
import Price from '@/components/products/price';
import { ActiveCustomerOrderListQuery } from '@/graphql-types.generated';
import { OrderStateBadge } from '@/components/account/order-state-badge';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type OrderHistoryItemProps = {
  order?: NonNullable<
    ActiveCustomerOrderListQuery['activeCustomer']
  >['orders']['items'][number];
  isInitiallyExpanded?: boolean;
  areDetailsInitiallyExpanded?: boolean;
  className?: string;
};

export default function OrderHistoryItem({
  order,
  isInitiallyExpanded = false,
  areDetailsInitiallyExpanded = false,
  className,
}: OrderHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(isInitiallyExpanded);
  const [areDetailsExpanded, setAreDetailsExpanded] = useState<boolean>(
    areDetailsInitiallyExpanded,
  );
  const [isLineCalcExpanded, setIsLineCalcExpanded] = useState<boolean>(false);

  return (
    <div className={className}>
      {/* Upper Summary */}
      <div>
        {/* Infos */}
        <div>
          {/* Info - Date */}
          <div>
            <span>Date placed</span>
            <span title={new Date(order?.orderPlacedAt).toLocaleString()}>
              {order?.orderPlacedAt
                ? new Date(order.orderPlacedAt).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '--'}
            </span>
          </div>
          {/* Info - Total sum */}
          <div>
            <span>Total sum</span>
            <span>
              <Price
                currencyCode={order?.currencyCode}
                priceWithTax={order?.totalWithTax}
              />
            </span>
          </div>
          {/* Info - Order number */}
          <div>
            <span>Order number</span>
            <span>{order?.code || '--'}</span>
          </div>
        </div>

        {/* Status + Actions */}
        <div>
          <OrderStateBadge state={order?.state} />
          <div>
            <Button title="Actions for this order (Not implemented)">
              <span>Actions</span>
              <EllipsisVerticalIcon />
            </Button>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              title="Expand this order"
            >
              <ChevronRightIcon
                className={`w-5 h-5 transition-transform duration-100 ${
                  isExpanded && 'rotate-90'
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsable details */}
      {isExpanded && (
        <div>
          {order?.lines.map((line, key) => (
            <div key={key}>
              {/* Product */}
              <div>
                <Link href={`/products/${line.productVariant.product.slug}`}>
                  <Image src={line.featuredAsset?.source} />
                </Link>
                <span>
                  {/* Product name */}
                  <Link
                    href={`/products/${line.productVariant.product.slug}`}
                    title={line.productVariant.name}
                  >
                    {line.productVariant.name}
                  </Link>
                  {/* Price and quantity */}
                  <button
                    onClick={() => setIsLineCalcExpanded(!isLineCalcExpanded)}
                  >
                    {isLineCalcExpanded && (
                      <>
                        <span title="Quantity">{line.quantity}</span>
                        <span>×</span>
                        <span title="Price per unit">
                          <Price
                            currencyCode={line.productVariant.currencyCode}
                            priceWithTax={line.discountedUnitPriceWithTax}
                          />
                        </span>
                        <span>Ξ</span>
                      </>
                    )}
                    <span title="Subtotal">
                      <Price
                        currencyCode={line.productVariant.currencyCode}
                        priceWithTax={line.discountedLinePriceWithTax}
                      />
                    </span>
                  </button>
                  {/* Shipment status */}
                  <span>
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
                  </span>
                </span>
              </div>
            </div>
          ))}

          {/* Per order actions */}
          <div>
            {order?.fulfillments?.map((f, i) => (
              <Button
                key={i}
                onClickCapture={() =>
                  alert(
                    `Here you'd need to Link your delivery service. Tracking code for this package is "${f.trackingCode}"`,
                  )
                }
              >
                {/* Only show package number if there are more than one: Looks cleaner */}
                Track package{' '}
                {order.fulfillments?.length == 1 ? '' : `#${i + 1}`}
              </Button>
            ))}
            <Button onClick={() => setAreDetailsExpanded(!areDetailsExpanded)}>
              <span>Detailed overview</span>
              <ChevronRightIcon
                className={`w-5 h-5 transition-transform duration-100 ${
                  areDetailsExpanded && 'rotate-90'
                }`}
              />
            </Button>
          </div>

          {/* More details - Could be expanded with shipping adresses, payment option, etc. */}
          {areDetailsExpanded && (
            <div>
              <h6>Order summary</h6>
              <span>Item(s) Subtotal:</span>
              <span>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.subTotalWithTax}
                />
              </span>

              <span>Shipping & handling:</span>
              <span>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.shippingLines.reduce(
                    (acc, s) => acc + s.priceWithTax,
                    0,
                  )}
                />
              </span>

              <span>Total before tax:</span>
              <span>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.taxSummary.reduce(
                    (acc, t) => acc + t.taxBase,
                    0,
                  )}
                />
              </span>

              <span>Estimated tax:</span>
              <span>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.taxSummary.reduce(
                    (acc, t) => acc + t.taxTotal,
                    0,
                  )}
                />
              </span>

              <span>Total:</span>
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

              <span>Applied coupons:</span>
              <span>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.discounts.reduce(
                    (acc, curr) => acc + curr.amountWithTax,
                    0,
                  )}
                />
              </span>

              <span>Grand total:</span>
              <span>
                <Price
                  currencyCode={order?.currencyCode}
                  priceWithTax={order?.totalWithTax}
                />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
