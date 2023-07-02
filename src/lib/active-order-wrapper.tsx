import React, { createContext } from 'react';
import { useActiveOrder } from '@/utils/use-active-order';
import { ActiveOrderQuery as ActiveOrderQueryType } from '@/graphql-types.generated';

interface ActiveOrderType {
  activeOrderFetcher: any;
  activeOrder?: ActiveOrderQueryType['activeOrder'];
  adjustOrderLine: any;
  removeItem: any;
  refresh: any;
}

export const ActiveOrderContext = createContext<ActiveOrderType>({
  activeOrderFetcher: null,
  activeOrder: undefined,
  adjustOrderLine: null,
  removeItem: null,
  refresh: null,
});

const ActiveOrderWrapper = ({ children }: { children: JSX.Element }) => {
  const {
    activeOrderFetcher,
    activeOrder,
    adjustOrderLine,
    removeItem,
    refresh,
  } = useActiveOrder();

  return (
    <ActiveOrderContext.Provider
      value={{
        activeOrderFetcher,
        activeOrder,
        adjustOrderLine,
        removeItem,
        refresh,
      }}
    >
      {children}
    </ActiveOrderContext.Provider>
  );
};

export default ActiveOrderWrapper;
