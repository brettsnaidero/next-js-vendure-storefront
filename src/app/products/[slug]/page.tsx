'use client';

import { Metadata, ResolvingMetadata } from 'next';
import { useState } from 'react';
import Price from '@/components/products/price';
import { ProductQuery } from '@/providers/products/products';
import Breadcrumbs from '@/components/breadcrumbs';
import { CheckIcon, HeartIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { APP_META_TITLE } from '@/constants';
// import { FetcherWithComponents } from '@/types';
// import { sessionStorage } from '@/sessions';
import {
  ActiveOrderQuery as ActiveOrderQueryType,
  AddItemToOrderMutation as AddItemToOrderMutationType,
  ProductQuery as ProductQueryType,
} from '@/graphql-types.generated';
import Alert from '@/components/alert';
import StockLevelLabel from '@/components/products/stock-level-label';
import TopReviews from '@/components/products/top-reviews';
import ScrollableContainer from '@/components/products/scrollable-container';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import {
  ActiveOrderQuery,
  AddItemToOrderMutation,
} from '@/providers/orders/order';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  // const { data } = useSuspenseQuery<ProductQueryType>(ProductQuery);

  // return {
  //   title: data?.product?.name
  //     ? `${data.product.name} - ${APP_META_TITLE}`
  //     : APP_META_TITLE,
  // };
  return {
    title: 'Product name here',
  };
}

// Not sure what this was for?
// 'Set-Cookie': await sessionStorage.commitSession(session)

const ProductPage = () => {
  const { data, error } = useSuspenseQuery<ProductQueryType>(ProductQuery);
  const { data: activeOrderData } =
    useSuspenseQuery<ActiveOrderQueryType>(ActiveOrderQuery);
  const [addItemToOrder, { error: addItemToOrderError }] =
    useMutation<AddItemToOrderMutationType>(AddItemToOrderMutation);

  const findVariantById = (id?: string) =>
    data?.product?.variants.find((v) => v.id === id);

  const [selectedVariantId, setSelectedVariantId] = useState(
    data?.product?.variants[0].id,
  );
  const selectedVariant = findVariantById(selectedVariantId);
  if (!selectedVariant) {
    setSelectedVariantId(data?.product?.variants[0].id);
  }

  const qtyInCart =
    activeOrderData?.activeOrder?.lines.find(
      (l) => l.productVariant.id === selectedVariantId,
    )?.quantity ?? 0;

  const asset = data?.product?.assets[0];
  const brandName = data?.product?.facetValues.find(
    (fv) => fv.facet.code === 'brand',
  )?.name;

  const [featuredAsset, setFeaturedAsset] = useState(
    selectedVariant?.featuredAsset,
  );

  const handleSubmit = () => {
    addItemToOrder();
  };

  if (error) {
    return (
      <div>
        <h2>Product not found!</h2>
        <div>
          {/* Image gallery */}
          <div>
            <span>
              <div>
                <PhotoIcon></PhotoIcon>
              </div>
            </span>
          </div>

          {/* Product info */}
          <div>
            <div>We couldn&rsquo;t find any product at that address!</div>
            <div>
              <div></div>
              <div>
                <div>
                  <div></div>
                  <div></div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.product) {
    return <div>Product not found!</div>;
  }

  return (
    <div>
      <div>
        <h2>{data?.product.name}</h2>
        <Breadcrumbs
          items={
            data?.product.collections[data?.product.collections.length - 1]
              ?.breadcrumbs ?? []
          }
        ></Breadcrumbs>
        <div>
          {/* Image gallery */}
          <div>
            <span>
              <div>
                <Image
                  src={
                    (featuredAsset?.preview ||
                      data?.product.featuredAsset?.preview) + '?w=800'
                  }
                  alt={data?.product.name}
                />
              </div>
            </span>

            {data?.product.assets.length > 1 && (
              <ScrollableContainer>
                {data?.product.assets.map((asset) => (
                  <div
                    key={asset?.id}
                    className={`${
                      featuredAsset?.id == asset.id ? 'outline' : ''
                    }`}
                    onClick={() => {
                      setFeaturedAsset(asset);
                    }}
                  >
                    <Image
                      alt={asset?.preview}
                      src={
                        `${asset.preview}?preset=full` /* not ideal, but technically prevents loading 2 seperate images */
                      }
                    />
                  </div>
                ))}
              </ScrollableContainer>
            )}
          </div>

          {/* Product info */}
          <div>
            <div>
              <h3>Description</h3>

              <div
                dangerouslySetInnerHTML={{
                  __html: data?.product.description,
                }}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="action" value="addItemToOrder" />
              {1 < data?.product.variants.length ? (
                <div>
                  <label htmlFor="option">Select option</label>
                  <select
                    id="productVariant"
                    value={selectedVariantId}
                    name="variantId"
                    onChange={(e) => {
                      setSelectedVariantId(e.target.value);

                      const variant = findVariantById(e.target.value);
                      if (variant) {
                        setFeaturedAsset(variant!.featuredAsset);
                      }
                    }}
                  >
                    {data?.product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="hidden"
                  name="variantId"
                  value={selectedVariantId}
                ></input>
              )}

              <div>
                <p>
                  <Price
                    priceWithTax={selectedVariant?.priceWithTax}
                    currencyCode={selectedVariant?.currencyCode}
                  />
                </p>
                <div>
                  <button
                    type="submit"
                    className={`${
                      qtyInCart === 0 ? 'something' : 'something else'
                    }`}
                    // disabled={activeOrderFetcher.state !== 'idle'}
                  >
                    {qtyInCart ? (
                      <span>
                        <CheckIcon /> {qtyInCart} in cart
                      </span>
                    ) : (
                      `Add to cart`
                    )}
                  </button>

                  <button type="button">
                    <HeartIcon aria-hidden="true" />
                    <span>Add to favorites</span>
                  </button>
                </div>
              </div>
              <div>
                <span>{selectedVariant?.sku}</span>
                <StockLevelLabel stockLevel={selectedVariant?.stockLevel} />
              </div>
              {addItemToOrderError && (
                <div>
                  <Alert message={addItemToOrderError?.message} />
                </div>
              )}

              <section>
                <h3>Shipping & Returns</h3>
                <div>
                  <p>
                    Standard shipping: 3 - 5 working days. Express shipping: 1 -
                    3 working days.
                  </p>
                  <p>
                    Shipping costs depend on delivery address and will be
                    calculated during checkout.
                  </p>
                  <p>
                    Returns are subject to terms. Please see the{' '}
                    <span>returns page</span> for further information.
                  </p>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
      <div>
        <TopReviews />
      </div>
    </div>
  );
};

export default ProductPage;
