import {
  ActiveChannelQueryVariables,
  ActiveCustomerQuery as ActiveCustomerQueryType,
} from '@/graphql-types.generated';
import { ActiveCustomerQuery } from '@/providers/customer/customer';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

export const useActiveCustomer = () => {
  const { data, refetch, error } = useSuspenseQuery<
    ActiveCustomerQueryType,
    ActiveChannelQueryVariables
  >(ActiveCustomerQuery);

  return {
    activeCustomer: data?.activeCustomer,
    refetch,
  };
};
