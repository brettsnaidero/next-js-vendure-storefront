import React, { createContext } from 'react';
import {
  CustomerInformation,
  ShippingData,
  useActiveOrder,
} from '@/utils/use-active-order';
import {
  ActiveOrderQuery as ActiveOrderQueryType,
  ErrorResult,
} from '@/graphql-types.generated';

interface ActiveOrderType {
  activeOrder?: ActiveOrderQueryType['activeOrder'];
  addItem?: (productVariantId: string) => void;
  removeItem?: (lineId: string) => void;
  adjustItem?: (lineId: string, quantity: number) => void;
  setOrderCustomer?: (customerInformation: CustomerInformation) => void;
  setShippingMethod?: (changeShippingMethod: string) => void;
  setCheckoutShipping?: (shippingFormData: ShippingData) => void;
  refresh: () => void;
  error?: ErrorResult;
}

export const ActiveOrderContext = createContext<ActiveOrderType>({
  activeOrder: undefined,
  addItem: undefined,
  removeItem: undefined,
  adjustItem: undefined,
  setOrderCustomer: undefined,
  setShippingMethod: undefined,
  setCheckoutShipping: undefined,
  refresh: () => {},
  error: undefined,
});

const ActiveOrderWrapper = ({ children }: { children: JSX.Element }) => {
  const {
    activeOrder,
    addItem,
    removeItem,
    adjustItem,
    setOrderCustomer,
    setShippingMethod,
    setCheckoutShipping,
    refresh,
    error,
  } = useActiveOrder();

  return (
    <ActiveOrderContext.Provider
      value={{
        activeOrder,
        addItem,
        removeItem,
        adjustItem,
        setOrderCustomer,
        setShippingMethod,
        setCheckoutShipping,
        refresh,
        error,
      }}
    >
      {children}
    </ActiveOrderContext.Provider>
  );
};

export default ActiveOrderWrapper;
