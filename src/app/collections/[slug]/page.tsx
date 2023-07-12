'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@apollo/client';
import CollectionCard from '@/components/collections/collection-card';
import Breadcrumbs from '@/components/breadcrumbs';
import FilterableProductGrid from '@/components/products/filterable-product-grid';
import FiltersButton from '@/components/filters-button';
import { CollectionQuery } from '@/providers/collections/collections';
import { CollectionQuery as CollectionQueryType } from '@/graphql-types.generated';
import useFilteredProductSearch from '@/utils/use-filtered-product-search';
import styles from '@/styles/pages/collections.module.css';

// import { APP_META_TITLE } from '@/constants';

// export const meta: MetaFunction = ({ data }) => {
//   return {
//     title: data?.collection
//       ? `${data.collection?.name} - ${APP_META_TITLE}`
//       : APP_META_TITLE,
//   };
// };

const paginationLimitMinimumDefault = 24;
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  48,
  96,
]);

const CollectionSlug = ({ params }: { params: { slug: string } }) => {
  const { data, error } = useSuspenseQuery<CollectionQueryType>(
    CollectionQuery,
    {
      variables: {
        slug: params.slug,
      },
    },
  );

  const {
    result,
    resultWithoutFacetValueFilters,
    facetValueIds,
    appliedPaginationLimit,
    appliedPaginationPage,
  } = useFilteredProductSearch({
    slug: params.slug,
    pagePath: `/collections/${params.slug}`,
    allowedPaginationLimits,
    paginationLimitMinimumDefault,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Not found
  if (error || !data?.collection) {
    return (
      <div>
        <h2>Collection not found!</h2>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.heading}>
        <h2>{data?.collection?.name}</h2>

        <FiltersButton
          filterCount={facetValueIds.length}
          onClick={() => setMobileFiltersOpen(true)}
        />
      </div>

      <Breadcrumbs items={data?.collection.breadcrumbs} />

      {/* Child collections (eg. Electronics > Computers) */}
      {data?.collection.children?.length ? (
        <div className={styles.subcategories}>
          <h3>Collections</h3>
          <div className={styles.collections}>
            {data?.collection.children.map((child) => (
              <CollectionCard key={child.id} collection={child} />
            ))}
          </div>
        </div>
      ) : null}

      <FilterableProductGrid
        basePath={`/collections/${params.slug}`}
        result={result}
        resultWithoutFacetValueFilters={resultWithoutFacetValueFilters}
        facetValueIds={facetValueIds}
        allowedPaginationLimits={allowedPaginationLimits}
        appliedPaginationLimit={appliedPaginationLimit}
        appliedPaginationPage={appliedPaginationPage}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
    </div>
  );
};

export default CollectionSlug;
