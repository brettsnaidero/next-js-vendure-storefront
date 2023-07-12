import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { LIMIT, PAGE } from '@/utils/use-filtered-product-search';
import styles from '@/styles/components/pagination.module.css';
import Select from '@/components/form/select';
import Button, { LinkButton } from '@/components/button';
import { useState } from 'react';

export type PaginationProps = {
  basePath: string;
  appliedPaginationLimit: number;
  allowedPaginationLimits: Set<number>;
  totalItems: number;
  appliedPaginationPage: number;
};

const Pagination = ({
  basePath,
  appliedPaginationLimit,
  allowedPaginationLimits,
  totalItems,
  appliedPaginationPage,
}: PaginationProps) => {
  const router = useRouter();

  // TODO
  const loading = false;

  const [_, paramString] = basePath.split('?');
  const searchParams = new URLSearchParams(paramString);

  // Take any existing page param off URL path
  searchParams.delete(PAGE);

  // Keep any other existing query params
  const existingParams = searchParams.toString();

  // Previous link
  const prevLink = `${basePath}?${existingParams}page=${
    appliedPaginationPage - 1
  }`;
  const disablePreviousLink = appliedPaginationPage <= 1;

  // Next link
  const nextLink = `${basePath}?${existingParams}page=${
    appliedPaginationPage + 1
  }`;
  const disableNextLink =
    appliedPaginationPage * appliedPaginationLimit >= totalItems;

  const changePerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    searchParams.delete(LIMIT);

    const existingParamsWithoutLimit = searchParams.toString();

    router.push(`${basePath}?${existingParamsWithoutLimit}limit=${value}`);
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.per}>
        <Select
          name="limit"
          value={appliedPaginationLimit}
          onChange={changePerPage}
          options={Array.from(allowedPaginationLimits).map((x) => ({
            value: x,
            label: `${x} per Page`,
          }))}
        />
        {loading && (
          <div className={styles.loading}>
            <ArrowPathIcon width={20} height={20} />
          </div>
        )}
      </div>

      <ul className={styles.nav}>
        <li>
          {disablePreviousLink ? (
            <Button className={styles.disabled} disabled>
              Previous
            </Button>
          ) : (
            <LinkButton href={prevLink}>Previous</LinkButton>
          )}
        </li>
        <li>
          {disableNextLink ? (
            <Button className={styles.disabled} disabled>
              Next
            </Button>
          ) : (
            <LinkButton href={nextLink}>Next</LinkButton>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
