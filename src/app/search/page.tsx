'use client';

import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { FacetFilterTracker } from '@/components/facet-filter/facet-filter-tracker';
// import { FiltersButton } from '@/components/filters-button';

import FilterableProductGrid from '@/components/products/filterable-product-grid';
import { useSuspenseQuery } from '@apollo/client';
import { SearchQuery } from '@/providers/products/products';
import { SearchQuery as SearchQueryType } from '@/graphql-types.generated';
import { useSearchParams } from 'next/navigation';

const paginationLimitMinimumDefault = 25;
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  50,
  100,
]);

const Search = () => {
  const searchParams = useSearchParams();
  const term = searchParams.get('term');
  const { data } = useSuspenseQuery<SearchQueryType>(SearchQuery, {
    variables: {
      input: {
        term,
      },
    },
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const submit = () => {};

  return (
    <div>
      <div>
        <h2>{data?.search ? `Results for "${term}"` : 'All results'}</h2>

        {/* <FiltersButton onClick={() => setMobileFiltersOpen(true)} /> */}
      </div>

      <form onSubmit={submit}>
        <FilterableProductGrid
          items={data?.search?.items}
          totalItems={data?.search?.totalItems}
          allowedPaginationLimits={allowedPaginationLimits}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
      </form>
    </div>
  );
};

export default Search;
