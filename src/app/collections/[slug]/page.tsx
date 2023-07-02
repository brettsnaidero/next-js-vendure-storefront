'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CollectionCard } from '@/components/collections/collection-card';
import Breadcrumbs from '@/components/breadcrumbs';
import { FacetFilterTracker } from '@/components/facet-filter/facet-filter-tracker';
import { FiltersButton } from '@/components/filters-button';
// import { FilterableProductGrid } from '@/components/products/filterable-product-grid';
import { APP_META_TITLE } from '@/constants';
// import { filteredSearchLoaderFromPagination } from '@/utils/filtered-search-loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// TODO: The "filteredSearchLoaderFromPagination" will need to be rewritten

// export const meta: MetaFunction = ({ data }) => {
//   return {
//     title: data?.collection
//       ? `${data.collection?.name} - ${APP_META_TITLE}`
//       : APP_META_TITLE,
//   };
// };

// const paginationLimitMinimumDefault = 25;
// const allowedPaginationLimits = new Set<number>([
//   paginationLimitMinimumDefault,
//   50,
//   100,
// ]);
// const { validator, filteredSearchLoader } = filteredSearchLoaderFromPagination(
//   allowedPaginationLimits,
//   paginationLimitMinimumDefault,
// );

// export async function loader({ params, request, context }: DataFunctionArgs) {
//   const {
//     result,
//     resultWithoutFacetValueFilters,
//     facetValueIds,
//     appliedPaginationLimit,
//     appliedPaginationPage,
//     term,
//   } = await filteredSearchLoader({
//     params,
//     request,
//     context,
//   });
//   const collection = (await sdk.collection({ slug: params.slug })).collection;
//   if (!collection?.id || !collection?.name) {
//     throw new Response('Not Found', {
//       status: 404,
//     });
//   }

//   return {
//     term,
//     collection,
//     result,
//     resultWithoutFacetValueFilters,
//     facetValueIds,
//     appliedPaginationLimit,
//     appliedPaginationPage,
//   };
// }

const CollectionSlug = ({ params }: { params: { slug: string } }) => {
  //   const {
  //     result,
  //     resultWithoutFacetValueFilters,
  //     facetValueIds,
  //     appliedPaginationLimit,
  //     appliedPaginationPage,
  //     term,
  //   } = await filteredSearchLoader({
  //     params,
  //     request,
  //     context,
  //   });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // const facetValuesTracker = useRef(new FacetFilterTracker());
  // facetValuesTracker.current.update(
  //   result,
  //   resultWithoutFacetValueFilters,
  //   facetValueIds,
  // );

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(z.object({})),
  });

  const onSubmit = () => {};

  // Not found
  if (true) {
    return (
      <div>
        <h2>Collection not found!</h2>
        <div>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div>
            <div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div>
  //     <div>
  //       <h2>{collection.name}</h2>

  //       <FiltersButton
  //         filterCount={facetValueIds.length}
  //         onClick={() => setMobileFiltersOpen(true)}
  //       />
  //     </div>

  //     <Breadcrumbs items={collection.breadcrumbs}></Breadcrumbs>
  //     {collection.children?.length ? (
  //       <div>
  //         <h2>Collections</h2>
  //         <div>
  //           {collection.children.map((child) => (
  //             <CollectionCard
  //               key={child.id}
  //               collection={child}
  //             ></CollectionCard>
  //           ))}
  //         </div>
  //       </div>
  //     ) : (
  //       ''
  //     )}

  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <FilterableProductGrid
  //         allowedPaginationLimits={allowedPaginationLimits}
  //         mobileFiltersOpen={mobileFiltersOpen}
  //         setMobileFiltersOpen={setMobileFiltersOpen}
  //         {...loaderData}
  //       />
  //     </form>
  //   </div>
  // );
};

export default CollectionSlug;
