import { useLazyQuery } from '@apollo/client';
import { GenerateBraintreeClientTokenQuery } from '@/providers/checkout/checkout';
import {
  GenerateBraintreeClientTokenQuery as GenerateBraintreeClientTokenQueryType,
  EligiblePaymentMethodsQuery as EligiblePaymentMethodsQueryType,
  GenerateBraintreeClientTokenQueryVariables,
} from '@/graphql-types.generated';
import { useEffect } from 'react';

export const useBraintree = ({
  eligiblePaymentMethods,
}: {
  eligiblePaymentMethods: EligiblePaymentMethodsQueryType['eligiblePaymentMethods'];
}) => {
  const [generateBraintreeClientToken, { data, error, loading }] = useLazyQuery<
    GenerateBraintreeClientTokenQueryType,
    GenerateBraintreeClientTokenQueryVariables
  >(GenerateBraintreeClientTokenQuery);

  const braintreeEnabled = eligiblePaymentMethods.find((method) =>
    method.code.includes('braintree'),
  );

  useEffect(() => {
    if (braintreeEnabled && !data) {
      generateBraintreeClientToken();
    }
  }, [braintreeEnabled, generateBraintreeClientToken, data]);

  return {
    key: data?.generateBraintreeClientToken,
    data,
    error,
    loading,
  };
};
