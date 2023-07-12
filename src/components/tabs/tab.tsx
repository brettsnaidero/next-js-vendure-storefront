import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/components/tabs.module.css';

export type TabProps = {
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  to: string;
};

const Tab = ({ Icon, text, to }: TabProps) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <li className={clsx([styles.tab, isActive ? styles.active : null])}>
      <Link
        href={to}
        className={clsx([styles.link, isActive ? styles.active : null])}
      >
        <Icon width={20} height={20} />
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default Tab;
