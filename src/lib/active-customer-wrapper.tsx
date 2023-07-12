'use client';

import React, { createContext } from 'react';
import { useActiveCustomer } from '@/utils/use-active-customer';
import { ActiveCustomerQuery as ActiveCustomerQueryType } from '@/graphql-types.generated';

interface ActiveCustomerType {
  activeCustomer?: ActiveCustomerQueryType['activeCustomer'];
  refetch: () => void;
}

export const ActiveCustomerContext = createContext<ActiveCustomerType>({
  activeCustomer: undefined,
  refetch: () => {},
});

const ActiveCustomerWrapper = ({ children }: { children: React.ReactNode }) => {
  const { activeCustomer, refetch } = useActiveCustomer();

  return (
    <ActiveCustomerContext.Provider
      value={{
        activeCustomer,
        refetch,
      }}
    >
      {children}
    </ActiveCustomerContext.Provider>
  );
};

export default ActiveCustomerWrapper;
