import { SearchQuery } from '@/graphql-types.generated';
import Link from 'next/link';
import Price from '@/components/products/price';
import Image from 'next/image';
import styles from '@/styles/components/product-grid.module.css';

export type ProductCardProps = SearchQuery['search']['items'][number];

const ProductCard = ({
  productAsset,
  productName,
  slug,
  priceWithTax,
  currencyCode,
}: ProductCardProps) => (
  <Link href={`/products/${slug}`} className={styles.product}>
    <Image
      alt={productName}
      src={productAsset?.preview + '?w=300&h=400'}
      width={300}
      height={400}
    />
    <div className={styles.name}>{productName}</div>
    <div className={styles.price}>
      <Price priceWithTax={priceWithTax} currencyCode={currencyCode} />
    </div>
  </Link>
);

export default ProductCard;
