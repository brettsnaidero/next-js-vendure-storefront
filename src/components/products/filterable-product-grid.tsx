import FacetFilterControls from '@/components/facet-filter/facet-filter-controls';
import ProductCard from '@/components/products/product-card';
import { Pagination } from '@/components/pagination';
import NoResultsHint from '@/components/products/no-results-hint';

const FilterableProductGrid = ({
  items,
  totalItems,
  allowedPaginationLimits,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  items: unknown;
  totalItems: unknown;
  allowedPaginationLimits: Set<number>;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (arg0: boolean) => void;
}) => {
  return (
    <div>
      <FacetFilterControls
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      {items.length > 0 ? (
        <div>
          <div>
            {items.map((item) => (
              <ProductCard key={item.productId} {...item} />
            ))}
          </div>

          <div>
            <span>
              Showing products {1} to {2}
            </span>
            <Pagination
              appliedPaginationLimit={appliedPaginationLimit}
              allowedPaginationLimits={allowedPaginationLimits}
              totalItems={totalItems}
              appliedPaginationPage={appliedPaginationPage}
            />
          </div>
        </div>
      ) : (
        <NoResultsHint facetFilterTracker={facetValuesTracker.current} />
      )}
    </div>
  );
};

export default FilterableProductGrid;
