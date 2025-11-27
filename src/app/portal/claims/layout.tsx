'use client';

import ClaimProvider from '@/components/layouts/ClaimLayout';

const Layout = ({ children }: Props): JSX.Element => {
  return <ClaimProvider>{children}</ClaimProvider>;
};
export default Layout;
