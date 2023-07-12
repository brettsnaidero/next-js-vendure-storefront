import { FunnelIcon } from '@heroicons/react/24/outline';
import Button from '@/components/button';
import styles from '@/styles/components/filters.module.css';

const FiltersButton = ({
  filterCount,
  onClick,
}: {
  filterCount: number;
  onClick: () => void;
}) => (
  <div className={styles.button}>
    <Button
      type="button"
      onClick={onClick}
      icon={<FunnelIcon width={20} height={20} />}
      role="secondary"
    >
      Filters
      {!!filterCount ? <span className={styles.count}>{filterCount}</span> : ''}
    </Button>
  </div>
);

export default FiltersButton;
