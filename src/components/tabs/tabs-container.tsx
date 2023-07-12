import { ReactNode } from 'react';
import Tab, { TabProps } from './tab';
import styles from '@/styles/components/tabs.module.css';

const TabsContainer = ({
  tabs,
  children,
}: {
  tabs: TabProps[];
  children?: ReactNode | string;
}) => (
  <>
    <ul className={styles.tabs}>
      {tabs.map((props) => (
        <Tab
          Icon={props.Icon}
          text={props.text}
          to={props.to}
          key={props.text}
        />
      ))}
    </ul>
    <div className={styles.content}>{children}</div>
  </>
);

export default TabsContainer;
