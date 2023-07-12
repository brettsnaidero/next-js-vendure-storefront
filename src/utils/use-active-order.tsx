import {
  useActiveOrderQuery,
  useRemoveOrderLineMutation,
  useAdjustOrderLineMutation,
  useSetOrderShippingAddressMutation,
  useSetCustomerForOrderMutation,
  useSetOrderShippingMethodMutation,
  useAddItemToOrderMutation,
  ErrorResult,
} from '@/graphql-types.generated';
import { useEffect, useState } from 'react';

export interface ShippingData {
  city?: string;
  company?: string;
  countryCode: string;
  fullName?: string;
  phoneNumber?: string;
  postalCode?: string;
  province?: string;
  streetLine1: string;
  streetLine2?: string;
  customFields?: string;
}

export interface CustomerInformation {
  emailAddress: string;
  firstName: string;
  lastName: string;
}

export const useActiveOrder = () => {
  const [error, setError] = useState<ErrorResult | undefined>(undefined);

  // Can't use suspense query, as refetch won't work?
  const { data, refetch, networkStatus } = useActiveOrderQuery();

  // Mutations
  const [addItemToOrder, { data: dataAdd, error: errorAdd }] =
    useAddItemToOrderMutation();
  const [removeOrderLine, { data: dataRemove, error: errorRemove }] =
    useRemoveOrderLineMutation();
  const [adjustOrderLine, { data: dataAdjust, error: errorAdjust }] =
    useAdjustOrderLineMutation();
  const [setOrderShippingAddress, { data: dataAddress, error: errorAddress }] =
    useSetOrderShippingAddressMutation();
  const [setCustomerForOrder, { data: dataCustomer, error: errorCustomer }] =
    useSetCustomerForOrderMutation();
  const [setOrderShippingMethod, { data: dataShipping, error: errorShipping }] =
    useSetOrderShippingMethodMutation();

  const addItem = (productVariantId: string): void => {
    addItemToOrder({
      variables: {
        productVariantId,
        quantity: 1,
      },
    });
  };

  const removeItem = (lineId: string): void => {
    removeOrderLine({
      variables: {
        orderLineId: lineId,
      },
    });
  };

  const adjustItem = (lineId: string, quantity: number): void => {
    adjustOrderLine({
      variables: {
        orderLineId: lineId,
        quantity,
      },
    });
  };

  const setOrderCustomer = (customerData: CustomerInformation) => {
    setCustomerForOrder({
      variables: {
        input: {
          emailAddress: customerData.emailAddress,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
        },
      },
    });
  };

  const setShippingMethod = (shippingMethodId: string) => {
    setOrderShippingMethod({
      variables: {
        shippingMethodId,
      },
    });
  };

  const setCheckoutShipping = (shippingFormData: ShippingData) => {
    setOrderShippingAddress({
      variables: {
        input: {
          city: shippingFormData.city,
          company: shippingFormData.company,
          countryCode: shippingFormData.countryCode,
          customFields: shippingFormData.customFields,
          fullName: shippingFormData.fullName,
          phoneNumber: shippingFormData.phoneNumber,
          postalCode: shippingFormData.postalCode,
          province: shippingFormData.province,
          streetLine1: shippingFormData.streetLine1,
          streetLine2: shippingFormData.streetLine2,
        },
      },
    });
  };

  // To reduce network requests, we should update the cache manually
  // https://www.apollographql.com/docs/react/data/mutations/#updating-local-data

  // Update active order state/errors after mutations
  useEffect(() => {
    if (dataAdd?.addItemToOrder?.__typename === 'Order') {
      refetch();
    } else {
      setError(dataAdd?.addItemToOrder);
    }
  }, [dataAdd, refetch]);

  useEffect(() => {
    if (dataRemove?.removeOrderLine?.__typename === 'Order') {
      refetch();
    } else {
      setError(dataRemove?.removeOrderLine);
    }
  }, [dataRemove, refetch]);

  useEffect(() => {
    if (dataAdjust?.adjustOrderLine?.__typename === 'Order') {
      refetch();
    } else {
      setError(dataAdjust?.adjustOrderLine);
    }
  }, [dataAdjust, refetch]);

  useEffect(() => {
    if (dataAddress?.setOrderShippingAddress?.__typename === 'Order') {
      refetch();
    } else {
      setError(dataAddress?.setOrderShippingAddress);
    }
  }, [dataAddress, refetch]);

  useEffect(() => {
    if (dataCustomer?.setCustomerForOrder?.__typename === 'Order') {
      refetch();
    } else {
      setError(dataCustomer?.setCustomerForOrder);
    }
  }, [dataCustomer, refetch]);

  useEffect(() => {
    if (dataShipping?.setOrderShippingMethod?.__typename === 'Order') {
      refetch();
    } else {
      setError(dataShipping?.setOrderShippingMethod);
    }
  }, [dataShipping, refetch]);

  return {
    activeOrder: data?.activeOrder,
    addItem,
    removeItem,
    adjustItem,
    setOrderCustomer,
    setShippingMethod,
    setCheckoutShipping,
    refresh: refetch,
    // https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/core/networkStatus.ts#L4
    loading: networkStatus < 7,
    error,
  };
};
