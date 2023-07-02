import { CurrencyCode } from '@/graphql-types.generated';
import { ProductCardProps } from './product-card';

const Price = ({
  priceWithTax,
  currencyCode,
}: {
  priceWithTax?: number | ProductCardProps['priceWithTax'];
  currencyCode?: ProductCardProps['currencyCode'];
}) => {
  if (priceWithTax == null || !currencyCode) {
    return <></>;
  }
  if (typeof priceWithTax === 'number') {
    return <>{formatPrice(priceWithTax, currencyCode)}</>;
  }
  if ('value' in priceWithTax) {
    return <>{formatPrice(priceWithTax.value, currencyCode)}</>;
  }
  if (priceWithTax.min === priceWithTax.max) {
    return <>{formatPrice(priceWithTax.min, currencyCode)}</>;
  }
  return (
    <>
      {formatPrice(priceWithTax.min, currencyCode)} -{' '}
      {formatPrice(priceWithTax.max, currencyCode)}
    </>
  );
};

export default Price;

export function formatPrice(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value / 100);
}
