'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/libs/utils/utils';

interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple'; // For future use if needed
  collapsible?: boolean;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  value?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div data-slot='accordion'>{children}</div>;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  className,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      isOpen,
      onClick: () => setIsOpen(!isOpen),
    });
  });

  return (
    <div
      data-slot='accordion-item'
      className={cn('border-b last:border-b-0', className)}
    >
      {clonedChildren}
    </div>
  );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className,
  onClick,
  isOpen,
}) => {
  return (
    <button
      data-slot='accordion-trigger'
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className,
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'text-muted-foreground size-4 transition-transform duration-200',
          isOpen ? 'rotate-180' : 'rotate-0',
        )}
      />
    </button>
  );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
  isOpen,
}) => {
  return (
    <div
      data-slot='accordion-content'
      className={cn(
        'overflow-hidden text-sm transition-all duration-300',
        isOpen ? 'max-h-96 pb-4 pt-2 opacity-100' : 'max-h-0 p-0 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
};
