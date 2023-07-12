import clsx from 'clsx';
import styles from '@/styles/components/status.module.css';

export type StockLevel = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';

const StockLevelLabel = ({ stockLevel }: { stockLevel?: string }) => {
  let stockLevelLabel = '';
  let badgeClasses = '';
  switch (stockLevel as StockLevel) {
    case 'IN_STOCK':
      stockLevelLabel = 'In stock';
      badgeClasses = styles.success;
      break;
    case 'OUT_OF_STOCK':
      stockLevelLabel = 'Out of stock';
      badgeClasses = styles.error;
      break;
    case 'LOW_STOCK':
      stockLevelLabel = 'Low stock';
      badgeClasses = styles.warning;
      break;
  }

  return (
    <span className={clsx([styles.level, badgeClasses])}>
      {stockLevelLabel}
    </span>
  );
};

export default StockLevelLabel;
