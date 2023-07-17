import {
  ActiveChannelQueryVariables,
  ActiveCustomerQuery as ActiveCustomerQueryType,
} from '@/graphql-types.generated';
import { ActiveCustomerQuery } from '@/providers/customer/customer';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useEffect } from 'react';

const authTokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string;

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
