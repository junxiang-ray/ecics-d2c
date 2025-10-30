import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/libs/utils/utils';

type Tone = 'info' | 'warning' | 'success';

const toneMap: Record<
  Tone,
  {
    border: string;
    bg: string;
    text: string;
    icon: React.ElementType;
    iconColor?: string;
  }
> = {
  info: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600',
  },

  warning: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  success: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
  },
};

interface NoticeProps {
  tone?: Tone;
  message?: string;
  className?: string;
  children?: React.ReactNode;
  errorRef?: React.RefObject<HTMLDivElement>;
}

export function Notice({
  tone = 'info',
  message,
  className,
  children,
  errorRef,
}: NoticeProps) {
  // boxed panel layout (default)
  const t = toneMap[tone];
  const Icon = t.icon;

  const outerClass = cn(
    'rounded-lg border p-4',

    t.border,
    t.bg,
    className,
  );

  return (
    <div ref={errorRef} className={outerClass}>
      <p className={cn('m-0 flex items-start gap-2 text-sm', t.text)}>
        <Icon className={cn('size-5 flex-shrink-0', t.iconColor)} />
        <span>{message || children}</span>
      </p>
    </div>
  );
}
