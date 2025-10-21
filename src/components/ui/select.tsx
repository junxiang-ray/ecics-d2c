'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/libs/utils/utils';

export function Select({
  options,
  placeholder = 'Select an option',
  className,
  onChange,
  defaultValue,
  disabled = false,
}: {
  options: string[];
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || '');

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
    onChange?.(value);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type='button'
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          'flex h-14 w-full items-center justify-between rounded-xl border-2 bg-white px-4 text-base transition-all duration-200',
          'hover:border-[#02ADEF]/60 hover:shadow-sm',
          'focus:border-[#02ADEF] focus:outline-none focus:ring-4 focus:ring-[#02ADEF]/10',
          'border-gray-200',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        disabled={disabled} // <--- add this
      >
        <span className={cn('truncate', !selected && 'text-gray-500')}>
          {selected || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 opacity-50 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && !disabled && (
        <ul className='absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg'>
          {options.map((opt) => (
            <li
              key={opt}
              className={cn(
                'flex cursor-pointer items-center justify-between px-4 py-3 text-base hover:bg-[#02ADEF]/5',
                selected === opt && 'bg-[#02ADEF]/10 font-medium',
              )}
              onClick={() => handleSelect(opt)}
            >
              {opt}
              {selected === opt && <Check className='size-4 text-[#02ADEF]' />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
