import Link from 'next/link';
import { CollectionsQuery } from '@/graphql-types.generated';

export function CollectionCard({
  collection,
}: {
  collection: CollectionsQuery['collections']['items'][number];
}) {
  return (
    <Link href={'/collections/' + collection.slug} key={collection.id} prefetch>
      <span aria-hidden="true">
        <div>
          <img src={collection.featuredAsset?.preview + '?w=300&h=300'} />
        </div>
      </span>
      <span aria-hidden="true" />
      <span>{collection.name}</span>
    </Link>
  );
}
