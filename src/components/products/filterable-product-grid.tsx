import FacetFilterControls from '@/components/facet-filter/facet-filter-controls';
import ProductCard from '@/components/products/product-card';
import Pagination from '@/components/pagination';
import NoResultsHint from '@/components/products/no-results-hint';
import { useRef } from 'react';
import FacetFilterTracker from '../facet-filter/facet-filter-tracker';
import { SearchFacetValuesQuery, SearchQuery } from '@/graphql-types.generated';
import {
  translatePaginationFrom,
  translatePaginationTo,
} from '@/utils/pagination';
import styles from '@/styles/components/product-grid.module.css';

const FilterableProductGrid = ({
  basePath,
  result,
  resultWithoutFacetValueFilters,
  facetValueIds,
  allowedPaginationLimits,
  appliedPaginationLimit,
  appliedPaginationPage,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  basePath: string;
  result: SearchQuery;
  resultWithoutFacetValueFilters?: SearchFacetValuesQuery;
  facetValueIds: string[];
  allowedPaginationLimits: Set<number>;
  appliedPaginationLimit: number;
  appliedPaginationPage: number;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (active: boolean) => void;
}) => {
  const facetValuesTracker = useRef(new FacetFilterTracker());
  facetValuesTracker.current.update(
    facetValueIds,
    result?.search,
    resultWithoutFacetValueFilters?.search,
  );

  return (
    <div className="layout-search">
      <FacetFilterControls
        facetFilterTracker={facetValuesTracker?.current}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />

      {result.search.items.length > 0 ? (
        <div className="layout-search-results">
          <div className={styles.grid}>
            {result.search.items.map((item) => (
              <ProductCard key={item.productId} {...item} />
            ))}
          </div>

          <div className={styles.pagination}>
            Showing products{' '}
            <strong>
              {translatePaginationFrom(
                appliedPaginationPage,
                appliedPaginationLimit,
              )}
            </strong>{' '}
            to{' '}
            <strong>
              {translatePaginationTo(
                appliedPaginationPage,
                appliedPaginationLimit,
                result.search.items.length,
              )}
            </strong>
          </div>
          <Pagination
            basePath={basePath}
            totalItems={result.search.totalItems}
            appliedPaginationLimit={appliedPaginationLimit}
            allowedPaginationLimits={allowedPaginationLimits}
            appliedPaginationPage={appliedPaginationPage}
          />
        </div>
      ) : (
        <NoResultsHint />
      )}
    </div>
  );
};

export default FilterableProductGrid;
