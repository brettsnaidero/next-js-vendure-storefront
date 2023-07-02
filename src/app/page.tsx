import { CollectionCard } from '@/components/collections/collection-card';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { getClient } from '@/lib/client';
import { CollectionsQuery } from '@/providers/collections/collections';
import { CollectionsQuery as CollectionsQueryType } from '@/graphql-types.generated';

async function getCollections() {
  const client = getClient();

  const result = await client.query<CollectionsQueryType>({
    query: CollectionsQuery,
  });

  return {
    collections: result.data?.collections?.items ?? [],
  };
}

export const dynamic = 'force-dynamic';

const Index = async () => {
  const { collections } = await getCollections();

  const headerImage = collections[0]?.featuredAsset?.preview;
  return (
    <>
      <div>
        {/* Decorative image and overlay */}
        <div aria-hidden="true">
          {headerImage && <img src={headerImage + '?w=800'} alt="header" />}
        </div>
        <div aria-hidden="true" />
        <div>
          <div>
            <h1>Vendure Next Starter</h1>
          </div>

          <p>
            A headless commerce storefront starter kit built with{' '}
            <a href="https://www.vendure.io">Vendure</a> &{' '}
            <a href="~/routes/__cart/index">Next</a>
          </p>
          <p>
            <BookOpenIcon />
            <span>Read more:</span>
            <a>Lightning Fast Headless Commerce with Vendure and Next</a>
          </p>
        </div>
      </div>

      <section aria-labelledby="category-heading">
        <div>
          <h2 id="category-heading">Shop by Category</h2>
        </div>

        <div>
          <div>
            <div>
              <div>
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <a href="~/routes/__cart/index#">
            Browse all categories
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </section>
    </>
  );
};

export default Index;
