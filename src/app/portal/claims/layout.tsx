'use client';

import ClaimProvider from '@/components/layouts/ClaimLayout';

interface Props {
  children: JSX.Element;
}

const Layout = ({ children }: Props): JSX.Element => {
  return <ClaimProvider>{children}</ClaimProvider>;
};
export default Layout;
