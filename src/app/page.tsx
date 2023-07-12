import CollectionCard from '@/components/collections/collection-card';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { CollectionsQuery } from '@/providers/collections/collections';
import {
  CollectionsQuery as CollectionsQueryType,
  CollectionsQueryVariables,
} from '@/graphql-types.generated';

import { getClient } from '@/lib/client';
import styles from '@/styles/pages/home.module.css';

async function getCollections() {
  const client = getClient();

  const result = await client.query<
    CollectionsQueryType,
    CollectionsQueryVariables
  >({
    query: CollectionsQuery,
  });

  return {
    collections: result.data?.collections?.items ?? [],
  };
}

export const dynamic = 'force-dynamic';

const Index = async () => {
  const { collections } = await getCollections();

  return (
    <div className={styles.home}>
      <section className={styles.intro}>
        <h1>Vendure Next.js Starter</h1>

        <p>
          A headless commerce storefront starter kit built with{' '}
          <a href="https://www.vendure.io">Vendure</a> &{' '}
          <a href="https://nextjs.org/">Next.js</a>
        </p>
      </section>

      <section aria-labelledby="category-heading">
        <div>
          <h2 id="category-heading">Shop by Category</h2>
        </div>

        <div className={styles.collections}>
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
