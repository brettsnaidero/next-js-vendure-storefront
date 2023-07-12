import {
  ActiveChannelQueryVariables,
  ActiveCustomerQuery as ActiveCustomerQueryType,
} from '@/graphql-types.generated';
import { ActiveCustomerQuery } from '@/providers/customer/customer';
import { useSuspenseQuery } from '@apollo/client';

export const useActiveCustomer = () => {
  const { data, refetch } = useSuspenseQuery<
    ActiveCustomerQueryType,
    ActiveChannelQueryVariables
  >(ActiveCustomerQuery);

  return {
    activeCustomer: data?.activeCustomer,
    refetch,
  };
};
