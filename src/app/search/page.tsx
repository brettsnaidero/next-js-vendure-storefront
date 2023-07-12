'use client';

import { useState } from 'react';
import FiltersButton from '@/components/filters-button';
import FilterableProductGrid from '@/components/products/filterable-product-grid';
import useFilteredProductSearch, {
  TERM,
} from '@/utils/use-filtered-product-search';
import styles from '@/styles/pages/collections.module.css';

const paginationLimitMinimumDefault = 24;
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  48,
  96,
]);

const Search = () => {
  const {
    result,
    resultWithoutFacetValueFilters,
    facetValueIds,
    appliedPaginationLimit,
    appliedPaginationPage,
    term,
  } = useFilteredProductSearch({
    pagePath: '/search',
    allowedPaginationLimits,
    paginationLimitMinimumDefault,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className={styles.heading}>
      <div>
        <h2>{result?.search ? `Results for "${term}"` : 'All results'}</h2>

        <FiltersButton
          filterCount={facetValueIds.length}
          onClick={() => setMobileFiltersOpen(true)}
        />
      </div>

      <FilterableProductGrid
        basePath={`/search?${TERM}=${term}`}
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

export default Search;
