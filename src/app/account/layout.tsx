'use client';

import {
  HashtagIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import TabsContainer from '@/components/tabs/tabs-container';
import { TabProps } from '@/components/tabs/tab';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '@/graphql-types.generated';
import { useContext, useEffect } from 'react';
import Button from '@/components/button';
import styles from '@/styles/pages/account.module.css';
import { ActiveCustomerContext } from '@/lib/active-customer-wrapper';
import { ActiveOrderContext } from '@/lib/active-order-wrapper';

const AccountDashboard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { refresh } = useContext(ActiveOrderContext);
  const { activeCustomer, refetch } = useContext(ActiveCustomerContext);
  const [logOut, { data: logOutData }] = useLogoutMutation();

  const { firstName, lastName } = activeCustomer || {};

  const tabs: TabProps[] = [
    {
      Icon: UserCircleIcon,
      text: 'Account Details',
      to: '/account',
    },
    {
      Icon: ShoppingBagIcon,
      text: 'Purchase History',
      to: '/account/history',
    },
    {
      Icon: MapPinIcon,
      text: 'Addresses',
      to: '/account/addresses',
    },
    {
      Icon: HashtagIcon,
      text: 'Password',
      to: '/account/password',
    },
  ];

  const signOut = (event: React.SyntheticEvent) => {
    event.preventDefault();

    logOut();

    refetch();
    refresh?.();
  };

  useEffect(() => {
    if (logOutData?.logout.success) {
      router.push('/sign-in');
    }
  }, [logOutData, router]);

  return (
    <div className={styles.account}>
      <div className={styles.heading}>
        <h2>My Account</h2>
        <p>
          Welcome back, {firstName} {lastName}
        </p>
        <form onSubmit={signOut}>
          <Button type="submit">Sign out</Button>
        </form>
      </div>
      <div className={styles.page}>
        <TabsContainer tabs={tabs}>{children}</TabsContainer>
      </div>
    </div>
  );
};

export default AccountDashboard;
