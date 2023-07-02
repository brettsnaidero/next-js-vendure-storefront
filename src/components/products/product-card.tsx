import { SearchQuery } from '@/graphql-types.generated';
import Link from 'next/link';
import Price from '@/components/products/price';
import Image from 'next/image';

export type ProductCardProps = SearchQuery['search']['items'][number];
const ProductCard = ({
  productAsset,
  productName,
  slug,
  priceWithTax,
  currencyCode,
}: ProductCardProps) => (
  <Link href={`/products/${slug}`}>
    <Image alt="" src={productAsset?.preview + '?w=300&h=400'} />
    <div />
    <div>{productName}</div>
    <div>
      <Price priceWithTax={priceWithTax} currencyCode={currencyCode} />
    </div>
  </Link>
);

export default ProductCard;
