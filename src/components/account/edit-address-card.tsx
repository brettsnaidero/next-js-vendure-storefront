'use client';

import { useState } from 'react';
import {
  ArrowPathIcon,
  CreditCardIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {
  ActiveCustomerAddressesFragment,
  useDeleteCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
} from '@/graphql-types.generated';
import Button, { LinkButton, ButtonTray } from '@/components/button';
import Modal from '@/components/modal/modal';
import Message from '@/components/message';
import styles from '@/styles/pages/account.module.css';

type EditAddressProps = {
  address: ActiveCustomerAddressesFragment;
  refetch: () => void;
};

const EditAddressCard = ({ address, refetch }: EditAddressProps) => {
  const [
    deleteAddress,
    { loading: deletingAddress, error: deletingAddressError },
  ] = useDeleteCustomerAddressMutation();
  const [updateCustomerAddress, { loading }] =
    useUpdateCustomerAddressMutation();

  const [isDeleteModalVisible, setDeleteModalVisible] =
    useState<boolean>(false);

  const removeAddress = (event: React.SyntheticEvent) => {
    event.preventDefault();

    deleteAddress({
      variables: { id: address.id },
    });
  };

  const setShipping = (event: React.SyntheticEvent) => {
    event.preventDefault();

    updateCustomerAddress({
      variables: {
        input: {
          id: address.id,
          defaultShippingAddress: true,
        },
      },
    });

    refetch();
  };

  const setBilling = (event: React.SyntheticEvent) => {
    event.preventDefault();

    updateCustomerAddress({
      variables: {
        input: {
          id: address.id,
          defaultBillingAddress: true,
        },
      },
    });

    refetch();
  };

  return (
    <>
      {/* Note: Only allow closing when it isnt loading to prevent accidental closing via outside-click */}
      <Modal
        isOpen={isDeleteModalVisible}
        close={() => setDeleteModalVisible(deletingAddress ? false : true)}
      >
        <form onSubmit={removeAddress}>
          <h2>Remove Address</h2>

          <div>
            Do you want to remove this address?
            {deletingAddressError && (
              <Message
                type="error"
                headingText="Address could not be removed"
                text={deletingAddressError?.message ?? 'Something went wrong.'}
              />
            )}
          </div>
          <ButtonTray>
            <Button
              type="button"
              onClick={() => setDeleteModalVisible(false)}
              disabled={deletingAddress}
              role="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={deletingAddress}>
              Yes
            </Button>
          </ButtonTray>
        </form>
      </Modal>

      <div className={styles.card}>
        <div className={styles.data}>
          {/* Customer Data Section */}
          <div>
            <div>
              <span>{address.fullName}</span>
              {address.company && <span> {address.company}</span>}
            </div>
            <div>
              <div>
                {address.streetLine1}
                {address.streetLine2 && <span>, {address.streetLine2}</span>}
              </div>
              <div>
                {address.postalCode}, {address.city}
              </div>
              <div>
                {address.province && `${address.province}, `}
                {address.country?.code?.toUpperCase()}
              </div>
            </div>
          </div>
          {/* Default Shipping/Billing Section */}
          {(address.defaultShippingAddress ||
            address.defaultBillingAddress) && (
            <div className={styles.default}>
              <h4>Default</h4>
              <p>
                {address.defaultShippingAddress && ' Shipping'}
                {address.defaultShippingAddress &&
                  address.defaultBillingAddress && (
                    <>
                      <br />
                      &amp;&nbsp;
                    </>
                  )}
                {address.defaultBillingAddress && 'Billing'}
              </p>
            </div>
          )}
        </div>

        {/* CRUD Actions */}
        <div className={styles.crud}>
          <ButtonTray>
            <LinkButton
              // preventScrollReset
              href={`/account/addresses/${address.id}`}
              icon={<PencilIcon width={20} height={20} />}
              size="small"
            >
              Edit
            </LinkButton>
            <Button
              type="button"
              role="negative"
              // title="Delete this address"
              disabled={deletingAddress}
              onClick={() => setDeleteModalVisible(true)}
              icon={
                deletingAddress ? (
                  <ArrowPathIcon width={20} height={20} />
                ) : (
                  <TrashIcon width={20} height={20} />
                )
              }
              size="small"
            >
              Remove
            </Button>

            {/* Default shipping and billing */}
            {!address.defaultShippingAddress && (
              <Button
                type="button"
                onClick={setShipping}
                disabled={loading}
                icon={
                  loading ? (
                    <ArrowPathIcon width={20} height={20} />
                  ) : (
                    <TruckIcon width={20} height={20} />
                  )
                }
                size="small"
                role="secondary"
              >
                Make default shipping address
              </Button>
            )}
            {!address.defaultBillingAddress && (
              <Button
                type="button"
                onClick={setBilling}
                // title="Set as default billing address"
                disabled={loading}
                icon={
                  loading ? (
                    <ArrowPathIcon width={20} height={20} />
                  ) : (
                    <CreditCardIcon width={20} height={20} />
                  )
                }
                size="small"
                role="secondary"
              >
                Make default billing address
              </Button>
            )}
          </ButtonTray>
        </div>
      </div>
    </>
  );
};

export default EditAddressCard;
