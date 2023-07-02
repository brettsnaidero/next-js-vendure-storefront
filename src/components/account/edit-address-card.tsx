'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowPathIcon,
  CreditCardIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {
  Address,
  DeleteCustomerAddressMutation as DeleteCustomerAddressMutationType,
} from '@/graphql-types.generated';
import { Button } from '../button';
import { ErrorMessage } from '../error-message';
import { HighlightedButton } from '../highlighted-button';
import Modal from '../modal/modal';
import { useMutation } from '@apollo/client';
import { DeleteCustomerAddressMutation } from '@/providers/account/account';

type EditAddressProps = {
  address: Address;
  isActive?: boolean;
};

const EditAddressCard = ({ address, isActive = false }: EditAddressProps) => {
  const [
    deleteAddress,
    {
      data: deleteAddressData,
      loading: deletingAddress,
      error: deletingAddressError,
    },
  ] = useMutation<DeleteCustomerAddressMutationType>(
    DeleteCustomerAddressMutation,
  );
  const [updateShipping, { loading: settingShipping }] = useMutation<unknown>();
  const [updateBilling, { loading: settingBilling }] = useMutation<unknown>();

  const [isDeleteModalVisible, setDeleteModalVisible] =
    useState<boolean>(false);

  // <input type="hidden" name="id" value={address.id} />

  const removeAddress = () => {
    deleteAddress();
  };
  const setShipping = () => {};
  const setBilling = () => {};

  return (
    <>
      {/* Note: Only allow closing when it isnt loading to prevent accidental closing via outside-click */}
      <Modal
        isOpen={isDeleteModalVisible}
        close={() => setDeleteModalVisible(deletingAddress ? false : true)}
      >
        <form onSubmit={removeAddress}>
          <Modal.Title>Remove Address</Modal.Title>
          <Modal.Body>
            <div>
              Do you want to remove this address?
              {deletingAddressError && (
                <ErrorMessage
                  heading="Address could not be removed"
                  message={
                    deletingAddressError?.message ?? 'Something went wrong.'
                  }
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={() => setDeleteModalVisible(false)}
              disabled={deletingAddress}
            >
              Cancel
            </Button>
            <HighlightedButton
              type="submit"
              name="_action"
              value="deleteAddress"
              disabled={deletingAddress}
              isSubmitting={deletingAddress}
            >
              Yes
            </HighlightedButton>
          </Modal.Footer>
        </form>
      </Modal>
      <div className={isActive ? 'active' : ''}>
        <div>
          {/* Customer Data Section */}
          <div>
            <span>{address.fullName}</span>
            {address.company && <span>{address.company}</span>}
            <div>
              <span>
                {address.streetLine1}
                {address.streetLine2 && <span>, {address.streetLine2}</span>}
              </span>
              <span>
                {address.postalCode}, {address.city}
              </span>
              <span>
                {address.province && `${address.province}, `}
                {address.country?.code?.toUpperCase()}
              </span>
            </div>
          </div>
          {/* Default Shipping/Billing Section */}
          {(address.defaultShippingAddress ||
            address.defaultBillingAddress) && (
            <div>
              <span>Default</span>
              <span>
                {address.defaultShippingAddress && 'Shipping'}
                {address.defaultShippingAddress &&
                  address.defaultBillingAddress && (
                    <>
                      <br />
                      &amp;&nbsp;
                    </>
                  )}
                {address.defaultBillingAddress && 'Billing'}
              </span>
            </div>
          )}
        </div>
        {/* CRUD Actions */}
        <div>
          <div>
            <Link
              role="button"
              // preventScrollReset
              href={`/account/addresses/${address.id}`}
            >
              <PencilIcon></PencilIcon>
              Edit
            </Link>
            <button
              type="button"
              title="Delete this address"
              disabled={deletingAddress}
              onClick={() => setDeleteModalVisible(true)}
            >
              {!deletingAddress ? (
                <TrashIcon></TrashIcon>
              ) : (
                <ArrowPathIcon></ArrowPathIcon>
              )}
              Remove
            </button>
          </div>
          {(!address.defaultShippingAddress ||
            !address.defaultBillingAddress) && (
            <div>
              <span>
                {/* Default shipping */}
                {!address.defaultShippingAddress && (
                  <form onSubmit={setShipping}>
                    <button
                      name="_action"
                      value="setDefaultShipping"
                      type="submit"
                      title="Set as default shipping address"
                      disabled={settingShipping}
                    >
                      {!settingShipping ? (
                        <TruckIcon></TruckIcon>
                      ) : (
                        <ArrowPathIcon></ArrowPathIcon>
                      )}
                      Shipping
                    </button>
                  </form>
                )}

                {!address.defaultBillingAddress && (
                  <form onSubmit={setBilling}>
                    <button
                      name="_action"
                      value="setDefaultBilling"
                      type="submit"
                      title="Set as default billing address"
                      disabled={settingBilling}
                    >
                      {!settingBilling ? (
                        <CreditCardIcon></CreditCardIcon>
                      ) : (
                        <ArrowPathIcon></ArrowPathIcon>
                      )}
                      Billing
                    </button>
                  </form>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditAddressCard;
