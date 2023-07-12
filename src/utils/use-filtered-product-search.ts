import { useRouter, useSearchParams } from 'next/navigation';
import { paginationValidationSchema } from '@/utils/pagination';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import {
  SearchFacetValuesQuery,
  SearchQuery,
} from '@/providers/products/products';
import {
  SearchQuery as SearchQueryType,
  SearchFacetValuesQuery as SearchFacetValuesQueryType,
} from '@/graphql-types.generated';

interface FiltersOptions {
  slug?: string;
  pagePath: string;
  allowedPaginationLimits: Set<number>;
  paginationLimitMinimumDefault: number;
}

export const TERM = 'q';
export const FACET_VALUE_ID_PARAM = 'fvid';
export const LIMIT = 'limit';
export const PAGE = 'page';

/**
 * This hook deals with loading product searches, which is used in both the search page and the
 * category list page.
 */
const useFilteredProductSearch = ({
  slug,
  pagePath,
  allowedPaginationLimits,
  paginationLimitMinimumDefault,
}: FiltersOptions) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get query params
  const term = searchParams.get(TERM);
  const facetValueIds = searchParams.getAll(FACET_VALUE_ID_PARAM);
  const limit = searchParams.get(LIMIT) ?? paginationLimitMinimumDefault;
  const page = searchParams.get(PAGE) ?? 1;

  const searchPaginationSchema = paginationValidationSchema(
    allowedPaginationLimits,
  );

  const zodResult = searchPaginationSchema.safeParse({ limit, page });

  // If limit/page are invalid, redirect to the same page without the invalid params
  if (!zodResult.success) {
    throw router.replace(pagePath);
  }

  const { data: result } = useSuspenseQuery<SearchQueryType>(SearchQuery, {
    variables: {
      input: {
        groupByProduct: true,
        term,
        facetValueFilters: [{ or: facetValueIds }],
        collectionSlug: slug,
        take: zodResult.data.limit,
        skip: (zodResult.data.page - 1) * zodResult.data.limit,
      },
    },
  });
  const { data: resultWithoutFacetValueFilters } =
    useSuspenseQuery<SearchFacetValuesQueryType>(SearchFacetValuesQuery, {
      variables: {
        input: {
          groupByProduct: true,
          term,
          collectionSlug: slug,
        },
      },
    });

  return {
    result: result,
    resultWithoutFacetValueFilters: resultWithoutFacetValueFilters,
    facetValueIds,
    appliedPaginationLimit: zodResult.data.limit,
    appliedPaginationPage: zodResult.data.page,
    term,
  };
};

export default useFilteredProductSearch;
