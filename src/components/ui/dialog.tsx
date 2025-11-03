'use client';

import { Button, Modal } from 'antd';
import { XIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/libs/utils/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  width?: number | string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  title,
  footer,
  closable = true,
  width = 600,
}: DialogProps) {
  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={footer}
      title={title}
      closable={closable}
      centered
      width={width}
      closeIcon={<XIcon className='text-gray-500 hover:text-gray-700' />}
      className={cn(
        'rounded-lg p-6 shadow-lg [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:p-6',
        className,
      )}
    >
      {children}
    </Modal>
  );
}

// ─────────────────────────────────────────────
// Subcomponents (to match your Radix structure)
// ─────────────────────────────────────────────

export const DialogTrigger = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Button
    type='default'
    onClick={onClick}
    className='rounded-lg px-4 py-2 font-medium shadow-sm transition-all hover:shadow-md'
  >
    {children}
  </Button>
);

export const DialogHeader = ({
  className,
  children,
}: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'mb-4 flex flex-col gap-2 text-center sm:text-left',
      className,
    )}
  >
    {children}
  </div>
);

export const DialogFooter = ({
  className,
  children,
}: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className,
    )}
  >
    {children}
  </div>
);

export const DialogTitle = ({
  className,
  children,
}: React.ComponentProps<'h2'>) => (
  <h2 className={cn('text-lg font-semibold leading-none', className)}>
    {children}
  </h2>
);

export const DialogDescription = ({
  className,
  children,
}: React.ComponentProps<'p'>) => (
  <p className={cn('text-sm text-gray-600', className)}>{children}</p>
);
