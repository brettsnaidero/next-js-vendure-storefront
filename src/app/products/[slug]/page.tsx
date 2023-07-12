'use client';

import { useEffect, useState } from 'react';
import Price from '@/components/products/price';
import { ProductQuery } from '@/providers/products/products';
import Breadcrumbs from '@/components/breadcrumbs';
import { CheckIcon, PhotoIcon } from '@heroicons/react/24/solid';
// import { APP_META_TITLE } from '@/constants';
// import { FetcherWithComponents } from '@/types';
// import { sessionStorage } from '@/sessions';
import { ProductQuery as ProductQueryType } from '@/graphql-types.generated';
import Message from '@/components/message';
import StockLevelLabel from '@/components/products/stock-level-label';
import TopReviews from '@/components/products/top-reviews';
import ScrollableContainer from '@/components/products/scrollable-container';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import Image from 'next/image';
import { useActiveOrder } from '@/utils/use-active-order';
import styles from '@/styles/pages/product.module.css';
import Button from '@/components/button';
import Select from '@/components/form/select';

// export async function generateMetadata(): Promise<Metadata> {
// const { data } = useSuspenseQuery<ProductQueryType>(ProductQuery);

// return {
//   title: data?.product?.name
//     ? `${data.product.name} - ${APP_META_TITLE}`
//     : APP_META_TITLE,
// };
//   return {
//     title: 'Product name here',
//   };
// }

// Not sure what this was for?
// 'Set-Cookie': await sessionStorage.commitSession(session)

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const { data, error } = useSuspenseQuery<ProductQueryType>(ProductQuery, {
    variables: {
      slug: params.slug,
      // id: params.id,
    },
  });

  const { activeOrder, addItem, error: addItemError } = useActiveOrder();

  const findVariantById = (id?: string) =>
    data.product?.variants.find((variant) => variant.id === id);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    data.product?.variants[0].id ?? '',
  );

  const selectedVariant = findVariantById(selectedVariantId);

  const [featuredAsset, setFeaturedAsset] = useState(
    selectedVariant?.featuredAsset,
  );

  // If no variant is available with that ID, reset by selecting the first one
  useEffect(() => {
    if (!selectedVariant) {
      setSelectedVariantId(data?.product?.variants[0].id ?? '');
    }
  }, [selectedVariant, data?.product?.variants]);

  const qtyInCart =
    activeOrder?.lines.find(
      (line) => line.productVariant.id === selectedVariantId,
    )?.quantity ?? 0;

  // const asset = data?.product?.assets[0];
  // const brandName = data?.product?.facetValues.find(
  //   (fv) => fv.facet.code === 'brand',
  // )?.name;

  const addToCart = (event: React.SyntheticEvent) => {
    event.preventDefault();

    addItem(selectedVariantId);
  };

  if (error || !data.product) {
    return (
      <div className={styles.product}>
        <h2>Product not found!</h2>

        <div className={styles.info}>
          {/* Image gallery */}
          <div>
            <PhotoIcon width={20} height={20} />
          </div>

          {/* Product info */}
          <div>We couldn&rsquo;t find any product at that address!</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.product}>
      <h2>{data.product.name}</h2>

      <Breadcrumbs
        items={
          data.product.collections[data?.product.collections.length - 1]
            ?.breadcrumbs ?? []
        }
      />

      <div className={styles.info}>
        {/* Image gallery */}
        <div>
          <div className={styles.gallery}>
            <Image
              src={
                (featuredAsset?.preview ||
                  data?.product.featuredAsset?.preview) + '?w=800'
              }
              alt={data?.product.name}
              width={800}
              height={600}
            />
          </div>

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
                    width={800}
                    height={600}
                  />
                </div>
              ))}
            </ScrollableContainer>
          )}
        </div>

        {/* Product info */}
        <div>
          <h3 className="sr-only">Description</h3>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: data.product.description,
            }}
          />

          <form onSubmit={addToCart} className={styles.form}>
            {1 < data.product.variants.length ? (
              <div className={styles.variants}>
                <label htmlFor="product-add__variant" className={styles.label}>
                  Select option
                </label>
                <Select
                  id="product-add__variant"
                  value={selectedVariantId}
                  name="variantId"
                  onChange={(event) => {
                    setSelectedVariantId(event.target.value);

                    const variant = findVariantById(event.target.value);
                    if (variant) {
                      setFeaturedAsset(variant!.featuredAsset);
                    }
                  }}
                  options={data.product.variants.map((variant) => ({
                    value: variant.id,
                    label: variant.name,
                  }))}
                  stretched
                />
              </div>
            ) : null}

            <div className={styles.quantity}>
              <p className={styles.price}>
                <Price
                  priceWithTax={selectedVariant?.priceWithTax}
                  currencyCode={selectedVariant?.currencyCode}
                />
              </p>

              <div>
                <Button
                  type="submit"
                  className={`${
                    qtyInCart === 0 ? 'something' : 'something else'
                  }`}
                  // disabled={loading}
                  icon={qtyInCart ? <CheckIcon /> : undefined}
                  size="large"
                >
                  {qtyInCart ? <span>{qtyInCart} in cart</span> : `Add to cart`}
                </Button>
              </div>
            </div>

            <div className={styles.stock}>
              <span className={styles.sku}>{selectedVariant?.sku}</span>
              <StockLevelLabel stockLevel={selectedVariant?.stockLevel} />
            </div>

            {addItemError && (
              <div>
                <Message text={addItemError?.message} type="error" />
              </div>
            )}

            <section className={styles.terms}>
              <h3>Shipping & Returns</h3>
              <p>
                Standard shipping: 3 - 5 working days. Express shipping: 1 - 3
                working days.
              </p>
              <p>
                Shipping costs depend on delivery address and will be calculated
                during checkout.
              </p>
              <p>
                Returns are subject to terms. Please see the{' '}
                <span>returns page</span> for further information.
              </p>
            </section>
          </form>
        </div>
      </div>

      <TopReviews />
    </div>
  );
};

export default ProductPage;
