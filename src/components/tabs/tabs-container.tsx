import { ReactNode } from 'react';
import { Tab, TabProps } from './tab';

export function TabsContainer({
  tabs,
  children,
}: {
  tabs: TabProps[];
  children: ReactNode | string;
}) {
  return (
    <>
      <div>
        <ul>
          {tabs.map((props) => (
            <Tab
              Icon={props.Icon}
              text={props.text}
              to={props.to}
              key={props.text}
            />
          ))}
        </ul>
      </div>
      {children}
    </>
  );
}
