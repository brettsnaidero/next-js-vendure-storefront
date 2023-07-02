'use client';

import { useEffect } from 'react';
import { Button } from '@/components/button';
import Modal from '@/components/modal/modal';
import { HighlightedButton } from '@/components/highlighted-button';
import {
  ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType,
  AvailableCountriesQuery as AvailableCountriesQueryType,
  UpdateCustomerAddressMutation as UpdateCustomerAddressMutationType,
} from '@/graphql-types.generated';
import useToggleState from '@/utils/use-toggle-state';
import CustomerAddressForm, {
  validator,
} from '@/components/account/customer-address-form';
import { UpdateCustomerAddressMutation } from '@/providers/account/account';
import { AvailableCountriesQuery } from '@/providers/checkout/checkout';
import { ActiveCustomerAddressesQuery } from '@/providers/customer/customer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useSuspenseQuery } from '@apollo/client';

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
const EditAddress = ({ params }: { params: { addressId: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: activeCustomerAddressesData } =
    useSuspenseQuery<ActiveCustomerAddressesQueryType>(
      ActiveCustomerAddressesQuery,
    );
  const { data: availableCountriesData } =
    useSuspenseQuery<AvailableCountriesQueryType>(AvailableCountriesQuery);
  const [updateCustomerAddress] =
    useMutation<UpdateCustomerAddressMutationType>(
      UpdateCustomerAddressMutation,
    );

  const address = activeCustomerAddressesData?.activeCustomer?.addresses?.find(
    (address) => address.id === params.addressId,
  );

  const { state, close } = useToggleState(true);

  useEffect(() => {
    // if (actionData?.saved) {
    //   close();
    // }
  }, [actionData]);

  if (!address) {
    return router.push('/account/addresses');
  }

  const submitForm = (data) => {
    updateCustomerAddress({
      id: params.addressId!,
      city: data.city,
      company: data.company,
      countryCode: data.countryCode,
      fullName: data.fullName,
      phoneNumber: data.phone,
      postalCode: data.postalCode,
      province: data.province,
      streetLine1: data.streetLine1,
      streetLine2: data.streetLine2,
    });
  };

  const afterClose = () => {
    router.back();
  };

  return (
    <div>
      <Modal isOpen={state} close={close} afterClose={afterClose}>
        <Modal.Title>Edit address</Modal.Title>
        <Modal.Body>
          <CustomerAddressForm
            address={address}
            availableCountries={availableCountriesData?.availableCountries}
            submit={submitForm}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={close}>
            Cancel
          </Button>
          <HighlightedButton
            isSubmitting={loading}
            type="submit"
            onClick={submitForm}
          >
            Save
          </HighlightedButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditAddress;
