import Link from 'next/link';
import { CollectionsQuery } from '@/graphql-types.generated';
import Image from 'next/image';
import styles from '@/styles/components/collections.module.css';

const CollectionCard = ({
  collection,
}: {
  collection: CollectionsQuery['collections']['items'][number];
}) => {
  return (
    <Link
      href={'/collections/' + collection.slug}
      key={collection.id}
      prefetch
      className={styles.card}
    >
      <span aria-hidden="true">
        <div>
          <Image
            alt={collection.name}
            src={collection.featuredAsset?.preview + '?w=300&h=300'}
            width={300}
            height={300}
          />
        </div>
      </span>
      <div className={styles.name}>{collection.name}</div>
    </Link>
  );
};

export default CollectionCard;
