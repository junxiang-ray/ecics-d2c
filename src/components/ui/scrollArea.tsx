'use client';

import { ConfigProvider } from 'antd';
import React from 'react';

import { cn } from '@/libs/utils/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  children: React.ReactNode;
}

/**
 * ScrollArea component using Ant Design + custom scrollbar styling
 */
export function ScrollArea({
  className,
  height = '100%',
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#fff',
        },
      }}
    >
      <div
        className={cn('relative overflow-auto rounded-md', className)}
        style={{
          height,
          scrollbarWidth: 'thin',
        }}
        {...props}
      >
        {children}
      </div>
    </ConfigProvider>
  );
}
