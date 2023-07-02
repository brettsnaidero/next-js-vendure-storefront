import Link from 'next/link';
import { usePathname } from 'next/navigation';

type IconElement = React.SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};

export type TabProps = {
  Icon: React.FC<IconElement>;
  text: string;
  to: string;
};

export const Tab = ({ Icon, text, to }: TabProps) => {
  const pathname = usePathname();
  const isActive = true; // TODO: matches.find((match) => match.pathname === pathname);

  return (
    <li className={isActive ? `cursor-default` : `cursor-pointer`}>
      <Link href={to} className={`${isActive ? 'active' : ''}`}>
        <Icon className={`${isActive ? 'active' : ''}`} />
        <p>{text}</p>
      </Link>
    </li>
  );
};
