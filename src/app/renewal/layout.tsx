'use client';

import { ReactNode } from 'react';

import { RenewalSessionWatcher } from '@/components/RenewalSessionWatcher';

export default function RenewalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RenewalSessionWatcher />
      {children}
    </>
  );
}
