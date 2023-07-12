'use client';

import React, { useState } from 'react';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import CartTray from '@/components/cart/cart-tray';
import { useSuspenseQuery } from '@apollo/client';
import { CollectionsQuery } from '@/providers/collections/collections';
import { CollectionsQuery as CollectionsQueryType } from '@/graphql-types.generated';
import { useActiveOrder } from '@/utils/use-active-order';

const Template = ({ children }: { children: JSX.Element }) => {
  const [open, setOpen] = useState(false);

  const { data: collectionsData } =
    useSuspenseQuery<CollectionsQueryType>(CollectionsQuery);

  const topLevelCollections = collectionsData?.collections?.items?.filter(
    (collection) => collection.parent?.name === '__root_collection__',
  );

  const { activeOrder } = useActiveOrder();

  return (
    <div>
      <Header
        onCartIconClick={() => setOpen(!open)}
        cartQuantity={activeOrder?.totalQuantity ?? 0}
        collections={topLevelCollections}
      />
      <CartTray open={open} onClose={setOpen} />

      {children}

      <Footer collections={collectionsData?.collections?.items}></Footer>
    </div>
  );
};

export default Template;
