'use client';

import { RenewalSessionWatcher } from '@/components/RenewalSessionWatcher';
import { ReactNode } from 'react';

export default function RenewalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RenewalSessionWatcher />
      {children}
    </>
  );
}
