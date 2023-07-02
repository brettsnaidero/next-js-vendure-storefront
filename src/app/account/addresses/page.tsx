import {
  Address,
  ErrorCode,
  ErrorResult,
  DeleteCustomerAddressMutation as DeleteCustomerAddressMutationType,
  UpdateCustomerAddressMutation as UpdateCustomerAddressMutationType,
  ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType,
} from '@/graphql-types.generated';

import AddAddressCard from '@/components/account/add-address-card';
import EditAddressCard from '@/components/account/edit-address-card';

import {
  DeleteCustomerAddressMutation,
  UpdateCustomerAddressMutation,
} from '@/providers/account/account';
import { ActiveCustomerAddressesQuery } from '@/providers/customer/customer';
import { useMutation, useSuspenseQuery } from '@apollo/client';

const AccountAddresses = () => {
  const { data } = useSuspenseQuery<ActiveCustomerAddressesQueryType>(
    ActiveCustomerAddressesQuery,
  );

  const [updateCustomerAddress] =
    useMutation<UpdateCustomerAddressMutationType>(
      UpdateCustomerAddressMutation,
    );
  const [deleteCustomerAddress] =
    useMutation<DeleteCustomerAddressMutationType>(
      DeleteCustomerAddressMutation,
    );

  const handleAddressActions = () => {
    // TODO: Handle address actions
    //   if (_action === 'setDefaultShipping') {
    //     updateCustomerAddress({ id, defaultShippingAddress: true }, { request });
    //     return null;
    //   }
    //   if (_action === 'setDefaultBilling') {
    //     updateCustomerAddress({ id, defaultBillingAddress: true }, { request });
    //     return null;
    //   }
    //   if (_action === 'deleteAddress') {
    //     const { success } = await deleteCustomerAddress(id, { request });
    //     return json(null, { status: success ? 200 : 400 });
    //   }
  };

  return (
    <>
      {/* <Outlet /> */}
      <div>
        <div>
          <AddAddressCard />
          {data?.activeCustomer?.addresses!.map((address) => {
            return (
              <EditAddressCard address={address as Address} key={address.id} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AccountAddresses;
