'use client';

import { ActiveCustomerOrderListQuery as ActiveCustomerOrderListQueryType } from '@/graphql-types.generated';

import { ActiveCustomerOrderListQuery } from '@/providers/customer/customer';
import { Pagination } from '@/components/pagination';
import OrderHistoryItem from '@/components/account/order-history-item';

import { paginationValidationSchema } from '@/utils/pagination';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSuspenseQuery } from '@apollo/client';
import { useEffect } from 'react';

const paginationLimitMinimumDefault = 10;
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  20,
  30,
]);

const AccountHistory = () => {
  const { data } = useSuspenseQuery<ActiveCustomerOrderListQueryType>(
    ActiveCustomerOrderListQuery,
  );

  // TODO: translatePaginationFrom(appliedPaginationPage, appliedPaginationLimit)
  const showingOrdersFrom = 1;
  const showingOrdersTo = 4;
  const appliedPaginationLimit = 1;
  const appliedPaginationPage = 1;

  // TODO: Register inputs/form
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(paginationValidationSchema(allowedPaginationLimits)),
  });

  // TODO: Handle form submit
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    // TypeScript users
    const subscription = watch(() => handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <div>
      {data?.activeCustomer?.orders.items.length === 0 && (
        <div>
          {data?.activeCustomer.orders.totalItems === 0
            ? 'Your future orders will appear here'
            : 'No more orders, end reached'}
        </div>
      )}
      {/* The actual orders */}
      {data?.activeCustomer?.orders.items?.map((item) => (
        <OrderHistoryItem
          key={item.code}
          // @ts-ignore
          order={item}
          isInitiallyExpanded={true}
        />
      ))}

      {/* Pagination */}
      <div>
        <span>
          Showing orders {showingOrdersFrom} to {showingOrdersTo} of{' '}
          {data?.activeCustomer?.orders.totalItems}
        </span>

        <form>
          <Pagination
            appliedPaginationLimit={appliedPaginationLimit}
            allowedPaginationLimits={allowedPaginationLimits}
            totalItems={data?.activeCustomer?.orders.totalItems}
            appliedPaginationPage={appliedPaginationPage}
          />
        </form>
      </div>
    </div>
  );
};

export default AccountHistory;
