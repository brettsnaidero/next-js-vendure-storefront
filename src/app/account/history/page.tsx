'use client';

import { useSuspenseQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ActiveCustomerOrderListQuery as ActiveCustomerOrderListQueryType } from '@/graphql-types.generated';
import { ActiveCustomerOrderListQuery } from '@/providers/customer/customer';
import Pagination from '@/components/pagination';
import OrderHistoryItem from '@/components/account/order-history-item';
import {
  paginationValidationSchema,
  translatePaginationFrom,
  translatePaginationTo,
} from '@/utils/pagination';
import { LIMIT, PAGE } from '@/utils/use-filtered-product-search';
import styles from '@/styles/pages/account.module.css';

const paginationLimitMinimumDefault = 10;
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  20,
  30,
]);

const searchPaginationSchema = paginationValidationSchema(
  allowedPaginationLimits,
);

const AccountHistory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useSuspenseQuery<ActiveCustomerOrderListQueryType>(
    ActiveCustomerOrderListQuery,
  );

  const limit = searchParams.get(LIMIT) ?? paginationLimitMinimumDefault;
  const page = searchParams.get(PAGE) ?? 1;

  const zodResult = searchPaginationSchema.safeParse({ limit, page });

  if (!zodResult.success) {
    router.replace('/account/history');

    return <div>Loading...</div>;
  }

  if (!data.activeCustomer) {
    router.replace('/');

    return <div>Loading...</div>;
  }

  const appliedPaginationPage = zodResult.data.page;
  const appliedPaginationLimit = zodResult.data.limit;

  return (
    <div>
      {data.activeCustomer.orders.items.length === 0 && (
        <div className={styles.nothing}>
          {data.activeCustomer.orders.totalItems === 0
            ? 'Your future orders will appear here'
            : 'No more orders, end reached'}
        </div>
      )}

      {data.activeCustomer.orders.items.map((item) => (
        <OrderHistoryItem key={item.code} order={item} />
      ))}

      {/* Pagination */}
      <div>
        <div className={styles.pagination}>
          Showing orders{' '}
          <strong>
            {translatePaginationFrom(
              appliedPaginationPage,
              appliedPaginationLimit,
            )}
          </strong>{' '}
          to{' '}
          <strong>
            {translatePaginationTo(
              appliedPaginationPage,
              appliedPaginationLimit,
              data.activeCustomer.orders.totalItems,
            )}
          </strong>{' '}
          of <strong>{data.activeCustomer.orders.totalItems}</strong>
        </div>

        <Pagination
          basePath="/account/history"
          totalItems={data.activeCustomer.orders.totalItems}
          allowedPaginationLimits={allowedPaginationLimits}
          appliedPaginationLimit={appliedPaginationLimit}
          appliedPaginationPage={appliedPaginationPage}
        />
      </div>
    </div>
  );
};

export default AccountHistory;
