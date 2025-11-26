'use client';

import PolicyProvider from '@/components/layouts/PolicyLayout';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  return <PolicyProvider>{children}</PolicyProvider>;
};
export default Layout;
