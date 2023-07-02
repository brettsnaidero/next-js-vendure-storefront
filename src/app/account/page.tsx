'use client';

import {
  HashtagIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { TabProps } from '@/components/tabs/tab';
import { TabsContainer } from '@/components/tabs/tabs-container';
import { ActiveCustomerDetailsQuery } from '@/providers/customer/customer';
import { useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType } from '@/graphql-types.generated';

const AccountDashboard = () => {
  const router = useRouter();
  const { data, error } = useSuspenseQuery<ActiveCustomerAddressesQueryType>(
    ActiveCustomerDetailsQuery,
  );

  if (data && !data?.activeCustomer) {
    return router.push('/sign-in');
  }

  const { firstName, lastName } = data?.activeCustomer || {};

  const tabs: TabProps[] = [
    {
      Icon: UserCircleIcon,
      text: 'Account Details',
      to: './',
    },
    {
      Icon: ShoppingBagIcon,
      text: 'Purchase History',
      to: './history',
    },
    {
      Icon: MapPinIcon,
      text: 'Addresses',
      to: './addresses',
    },
    {
      Icon: HashtagIcon,
      text: 'Password',
      to: './password',
    },
  ];

  return (
    <div>
      <h2>My Account</h2>
      <p>
        Welcome back, {firstName} {lastName}
      </p>
      <form method="post" action="/api/logout">
        <button type="submit">Sign out</button>
      </form>
      <TabsContainer tabs={tabs}>?</TabsContainer>
    </div>
  );
};

export default AccountDashboard;
