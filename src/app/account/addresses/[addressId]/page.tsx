'use client';

import React, { useEffect } from 'react';
import Button, { ButtonTray } from '@/components/button';
import Modal from '@/components/modal/modal';
import {
  ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType,
  AvailableCountriesQuery as AvailableCountriesQueryType,
  useUpdateCustomerAddressMutation,
} from '@/graphql-types.generated';
import useToggleState from '@/utils/use-toggle-state';
import CustomerAddressForm, {
  CustomerAddressFormFields,
} from '@/components/account/customer-address-form';
import { AvailableCountriesQuery } from '@/providers/checkout/checkout';
import { ActiveCustomerAddressesQuery } from '@/providers/customer/customer';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

// TODO: Should this be a page? It seems to be a component
const EditAddress = ({ params }: { params: { addressId: string } }) => {
  const router = useRouter();

  const { data: activeCustomerAddressesData } =
    useSuspenseQuery<ActiveCustomerAddressesQueryType>(
      ActiveCustomerAddressesQuery,
    );
  const { data: availableCountriesData } =
    useSuspenseQuery<AvailableCountriesQueryType>(AvailableCountriesQuery);

  const [updateCustomerAddress, { data, loading, error }] =
    useUpdateCustomerAddressMutation();

  const { state, close } = useToggleState(true);

  const closeModal = () => {
    close();
    router.back();
  };

  useEffect(() => {
    if (!error && data) {
      close();

      router.push('/account/addresses');
    }
  }, [data, error]);

  const address = activeCustomerAddressesData?.activeCustomer?.addresses?.find(
    (address) => address.id === params.addressId,
  );

  if (!address) {
    router.push('/account/addresses');

    return <div>Loading...</div>;
  }

  const submitForm = (data: CustomerAddressFormFields) => {
    updateCustomerAddress({
      variables: {
        input: {
          id: params.addressId,
          // Data
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
    <div>
      <Modal isOpen={state} close={closeModal}>
        <h2>Edit address</h2>
        <CustomerAddressForm
          address={address}
          availableCountries={availableCountriesData?.availableCountries}
          submit={submitForm}
        >
          <Button type="button" onClick={close} role="secondary">
            Cancel
          </Button>
        </CustomerAddressForm>
      </Modal>
    </div>
  );
};

export default EditAddress;
