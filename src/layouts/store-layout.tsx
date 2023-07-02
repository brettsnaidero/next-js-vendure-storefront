import { ReactNode } from 'react';
import { HeaderSection } from '@/sections/header-section';

interface Props {
  children: ReactNode;
}

export function StoreLayout(props: Props) {
  return (
    <>
      <HeaderSection />
      <main>{props.children}</main>
    </>
  );
}
