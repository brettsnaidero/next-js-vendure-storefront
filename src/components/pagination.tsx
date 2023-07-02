import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Select } from '@/components/select';
import { Button } from '@/components/button';
import { ComponentProps } from 'react';
import clsx from 'clsx';

export type PaginationProps = {
  appliedPaginationLimit: number;
  allowedPaginationLimits: Set<number>;
  totalItems: number;
  appliedPaginationPage: number;
};

export const Pagination = ({
  appliedPaginationLimit,
  allowedPaginationLimits,
  totalItems,
  appliedPaginationPage,
  ...props
}: PaginationProps & ComponentProps<'div'>) => {
  // TODO
  const loading = false;

  return (
    <div {...props} className={props.className}>
      <span>
        {!loading && <ArrowPathIcon />}
        <Select
          name="limit"
          required
          noPlaceholder
          defaultValue={appliedPaginationLimit}
        >
          {Array.from(allowedPaginationLimits).map((x) => (
            <option key={x} value={x}>
              {x} per Page
            </option>
          ))}
        </Select>
      </span>

      <div>
        <Button
          name="page"
          type="submit"
          value={appliedPaginationPage - 1}
          disabled={appliedPaginationPage <= 1 || loading}
        >
          Prev.
        </Button>
        <Button
          name="page"
          type="submit"
          value={appliedPaginationPage + 1}
          disabled={
            appliedPaginationPage * appliedPaginationLimit >= totalItems ||
            loading
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
