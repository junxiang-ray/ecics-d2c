'use client';

import { GlobalSessionWatcher } from '@/components/RenewalSessionWatcher';
import { ReactNode } from 'react';

export default function RenewalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalSessionWatcher />
      {children}
    </>
  );
}
