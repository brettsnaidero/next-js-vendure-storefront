'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal/modal';
import useToggleState from '@/utils/use-toggle-state';
import CustomerAddressForm, {
  CustomerAddressFormFields,
} from '@/components/account/customer-address-form';
import { AvailableCountriesQuery } from '@/providers/checkout/checkout';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import {
  AvailableCountriesQuery as AvailableCountriesQueryType,
  useCreateCustomerAddressMutation,
} from '@/graphql-types.generated';

// TODO: Should this be a page? It seems to be a component
const NewAddress = () => {
  const router = useRouter();
  const { data } = useSuspenseQuery<AvailableCountriesQueryType>(
    AvailableCountriesQuery,
  );

  const [
    createCustomerAddress,
    { data: createCustomerAddressData, loading, error },
  ] = useCreateCustomerAddressMutation();

  const { state, close } = useToggleState(true);

  const closeModal = () => {
    close();
    router.back();
  };

  useEffect(() => {
    if (!error && createCustomerAddressData) {
      close();
      router.push('/account/addresses');
    }
  }, [createCustomerAddressData, error]);

  const submitForm = (data: CustomerAddressFormFields) => {
    createCustomerAddress({
      variables: {
        input: {
          city: data.city,
          company: data.company,
          countryCode: data.countryCode,
          fullName: data.fullName,
          phoneNumber: data.phone,
          postalCode: data.postalCode,
          province: data.province,
          streetLine1: data.streetLine1,
          streetLine2: data.streetLine2,
        },
      },
    });
  };

  return (
    <Modal isOpen={state} close={closeModal}>
      <h2>New address</h2>
      <CustomerAddressForm
        availableCountries={data?.availableCountries}
        submit={submitForm}
      />
    </Modal>
  );
};

export default NewAddress;
