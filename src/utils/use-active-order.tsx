import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ActiveOrderQuery as ActiveOrderQueryType } from '@/graphql-types.generated';
import { ActiveOrderQuery } from '@/providers/orders/order';

export function useActiveOrder() {
  const [activeOrderFetcher, { data }] =
    useLazyQuery<ActiveOrderQueryType>(ActiveOrderQuery);

  useEffect(() => {
    // if (activeOrderFetcher.type === 'init') {
    //   activeOrderFetcher.load('/api/active-order');
    // }
  }, [activeOrderFetcher]);

  function refresh() {
    // activeOrderFetcher.load('/api/active-order');
  }

  const { activeOrder } = data ?? {};

  const removeItem = (lineId: string) => {
    // activeOrderFetcher.submit(
    //   {
    //     action: 'removeItem',
    //     lineId,
    //   },
    //   {
    //     method: 'post',
    //     action: '/api/active-order',
    //   },
    // );
  };

  const adjustOrderLine = (lineId: string, quantity: number) => {
    // activeOrderFetcher.submit(
    //   {
    //     action: 'adjustItem',
    //     lineId,
    //     quantity: quantity.toString(),
    //   },
    //   {
    //     method: 'post',
    //     action: '/api/active-order',
    //   },
    // );
  };

  return {
    activeOrderFetcher,
    activeOrder,
    removeItem,
    adjustOrderLine,
    refresh,
  };
}
