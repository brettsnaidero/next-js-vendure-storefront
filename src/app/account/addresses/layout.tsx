'use client';

import React from 'react';
import Link from 'next/link';
import EditAddressCard from '@/components/account/edit-address-card';

import { ActiveCustomerAddressesQuery } from '@/providers/customer/customer';
import { ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType } from '@/graphql-types.generated';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { PlusIcon } from '@heroicons/react/24/solid';
import { LinkButton } from '@/components/button';
import Message from '@/components/message';

const AccountAddresses = ({ children }: { children: React.ReactNode }) => {
  const { data, error, refetch } =
    useSuspenseQuery<ActiveCustomerAddressesQueryType>(
      ActiveCustomerAddressesQuery,
    );

  if (error) {
    return <Message type="error" text="There was an unexpected error" />;
  }

  return (
    <>
      {children}
      <div>
        <LinkButton
          href="/account/addresses/new"
          icon={<PlusIcon width={20} height={20} />}
          iconPosition="right"
          scroll={false}
        >
          New address
        </LinkButton>
        {data?.activeCustomer?.addresses!.map((address) => (
          <EditAddressCard
            address={address}
            key={address.id}
            refetch={refetch}
          />
        ))}
      </div>
    </>
  );
};

export default AccountAddresses;
