import { FunnelIcon } from '@heroicons/react/24/solid';

export function FiltersButton({
  filterCount,
  onClick,
}: {
  filterCount: number;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}>
      {!!filterCount ? <span>{filterCount}</span> : ''}
      <span>Filters</span>
      <FunnelIcon />
    </button>
  );
}
