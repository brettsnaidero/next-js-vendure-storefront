import styles from '@/styles/components/status.module.css';
import clsx from 'clsx';

// Copied from https://www.vendure.io/docs/typescript-api/orders/order-state/
type OrderState =
  | 'Created'
  | 'Draft'
  | 'AddingItems'
  | 'ArrangingPayment'
  | 'PaymentAuthorized'
  | 'PaymentSettled'
  | 'PartiallyShipped'
  | 'Shipped'
  | 'PartiallyDelivered'
  | 'Delivered'
  | 'Modifying'
  | 'ArrangingAdditionalPayment'
  | 'Cancelled';

// Lookup can be replaced once theres i18n support, for now simply pick with a fallback
const map = new Map<string, string>([
  ['Draft', 'Draft'],
  ['AddingItems', 'Adding items'],
  ['ArrangingPayment', 'Awaiting payment'],
  ['PaymentAuthorized', 'Payment authorized'],
  ['PaymentSettled', 'Payment settled'],
  ['PartiallyShipped', 'Partially shipped'],
  ['Shipped', 'Shipped'],
  ['PartiallyDelivered', 'Partially delivered'],
  ['Delivered', 'Delivered'],
  ['Modifying', 'Modifying'],
  ['ArrangingAdditionalPayment', 'Awaiting payment'],
  ['Cancelled', 'Cancelled'],
  ['Unknown', 'Unknown'],
]);

const OrderStateBadge = ({ state }: { state?: string }) => {
  let label = map.get(state ?? 'Unknown') ?? 'Unknown';
  let colorClasses = '';
  switch (state as OrderState) {
    default:
    case 'Draft':
    case 'AddingItems':
      colorClasses = styles.success;
      break;
    case 'PaymentAuthorized':
    case 'PaymentSettled':
    case 'Shipped':
      colorClasses = styles.info;
      break;
    case 'Delivered':
      colorClasses = styles.success;
      break;
    case 'PartiallyShipped':
    case 'PartiallyDelivered':
    case 'Modifying':
    case 'ArrangingPayment':
    case 'ArrangingAdditionalPayment':
      colorClasses = styles.warning;
      break;
    case 'Cancelled':
      colorClasses = styles.warning;
      break;
  }

  return (
    <div className={clsx([styles.level, styles.small, colorClasses])}>
      {label}
    </div>
  );
};

export default OrderStateBadge;
