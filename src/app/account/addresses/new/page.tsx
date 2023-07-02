'use client';

import { useEffect } from 'react';
import { Button } from '@/components/button';
import Modal from '@/components/modal/modal';
import { HighlightedButton } from '@/components/highlighted-button';
import useToggleState from '@/utils/use-toggle-state';
import CustomerAddressForm from '@/components/account/customer-address-form';
import { CreateCustomerAddressMutation } from '@/providers/account/account';
import { AvailableCountriesQuery } from '@/providers/checkout/checkout';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import {
  AvailableCountriesQuery as AvailableCountriesQueryType,
  CreateCustomerAddressMutation as CreateCustomerAddressMutationType,
} from '@/graphql-types.generated';
import { useRouter } from 'next/router';

const NewAddress = () => {
  const router = useRouter();
  const { data } = useSuspenseQuery<AvailableCountriesQueryType>(
    AvailableCountriesQuery,
  );
  const [createCustomerAddress, { data: actionData, loading }] =
    useMutation<CreateCustomerAddressMutationType>(
      CreateCustomerAddressMutation,
    );

  const { state, close } = useToggleState(true);

  useEffect(() => {
    // TODO: Check success
    if (actionData?.createCustomerAddress) {
      close();
    }
  }, [actionData]);

  const submitForm = () => {
    // submit(formRef.current);
  };

  const afterClose = () => {
    router.back();
  };

  return (
    <div>
      <Modal isOpen={state} close={close} afterClose={afterClose}>
        <Modal.Title>New address</Modal.Title>
        <Modal.Body>
          <CustomerAddressForm
            availableCountries={data?.availableCountries}
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

export default NewAddress;
